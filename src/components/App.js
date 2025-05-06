import { SelectActionPage } from "../pages/SelectActionPage.js";
import { OTPPage } from "../pages/OTPPage.js";
import { SelectItemPage } from "../pages/SelectItemPage.js";
import { SelectSlotPage } from "../pages/SelectSlotPage.js";
import { DisplaySlotPage } from "../pages/DisplaySlotPage.js";
import { WaitForLockerPage } from "../pages/WaitForLockerPage.js";
import { WaitForClosePage } from "../pages/WaitForClosePage.js";
import { FinalPage } from "../pages/FinalPage.js";

import { createState } from "../core/core.js";
import { performLockerAction, pollSlotClosed, resetLockerState } from "../services/api.js";

const [currentPage, setCurrentPage] = createState("selectAction");
const [selectedAction, setSelectedAction] = createState(null);
const [userSession, setUserSession] = createState(null);
const [selectedItem, setSelectedItem] = createState(null);
const [selectedSlot, setSelectedSlot] = createState(null);
const [pollingStarted, setPollingStarted] = createState(false);
const [otp, setOtp] = createState("");

const resetStates = () => {
  setCurrentPage("selectAction");
  setSelectedAction(null);
  setUserSession(null);
  setSelectedItem(null);
  setSelectedSlot(null);
  setPollingStarted(false);
  setOtp("");
  resetLockerState();
}

const renderPage = () => {
  if (currentPage() === "selectAction") {
    return SelectActionPage({
      onSelect: (action) => {
        setSelectedAction(action);
        setCurrentPage("otp");
      },
    });
  }

  if (currentPage() === "otp") {
    return OTPPage({
      action: selectedAction(),
      onVerified: (data) => {
        setUserSession(data);
        setCurrentPage("selectItem");
      },
      otp: otp,
      setOtp: setOtp,
    });
  }

  if (currentPage() === "selectItem") {
    return SelectItemPage({
      userName: userSession().user_name,
      items: userSession().items,
      selectedItem: selectedItem,
      setSelectedItem: setSelectedItem,
      onSelect: () => {
        if (selectedAction() == "store" || selectedAction() === "return") {
          setCurrentPage("selectSlot");
        } else {
          setCurrentPage("displaySlot");
        }
      },
    });
  }

  if (currentPage() === "selectSlot") {
    return SelectSlotPage({
      availableSlots: userSession().available_slots,
      selectedSlot: selectedSlot,
      setSelectedSlot: setSelectedSlot,
      onSelect: () => {
        setCurrentPage("waitForLocker");
      }
    });
  }

  if (currentPage() === "displaySlot") {
    return DisplaySlotPage({
      userName: userSession().user_name,
      selectedItem: selectedItem(),
      onConfirm: (slot) => {
        setSelectedSlot(slot);
        setCurrentPage("waitForLocker");
      },
    });
  }

  if (currentPage() === "waitForLocker") {
    performLockerAction({
      action: selectedAction(),
      item: selectedItem(),
      slot: selectedSlot(),
    }).then(res => {
      if (res.success) {
        setCurrentPage("waitForClose");
      } else {
        alert("사물함 동작에 실패했습니다. 다시 시도해주세요.");
        resetStates();
      }
    });

    return WaitForLockerPage({
      userName: userSession().user_name,
    });
  }

  if (currentPage() === "waitForClose") {
    if (!pollingStarted()) {
      setPollingStarted(true);
      
      pollSlotClosed().then((closed) => {
        if (closed) {
          setCurrentPage("final");
        } else {
          if (["store", "return"].includes(selectedAction())) {
            alert("사물함의 닫힘이 감지되지 않습니다. 다른 칸에 다시 맡겨주세요.");
          }
          resetStates();
        }
        setPollingStarted(false);
      }).catch((err) => {
        console.error("[POLL] 닫힘 확인 중 요류:", err);
        alert("사물함 상태 확인 중 오류가 발생했습니다.");
        resetStates();
        setPollingStarted(false);
      });
    }

    return WaitForClosePage({
      userName: userSession().user_name,
      slot: selectedSlot(),
    });
  }

  if (currentPage() === "final") {
    return FinalPage({
      userName: userSession().user_name,
      onTimeout: () => {
        resetStates();
      },
    });
  }

  return {
    html: `<div>페이지를 찾을 수 없습니다</div>`,
    handlers: {},
  };
};

export default function App() {
  const page = renderPage();

  return {
    html: `<div>${page.html}</div>`,
    handlers: { ...page.handlers },
  };
}
