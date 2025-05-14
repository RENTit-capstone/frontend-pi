import { SelectActionPage } from "../pages/SelectActionPage.js";
import { OTPPage } from "../pages/OTPPage.js";
import { SelectItemPage } from "../pages/SelectItemPage.js";
import { SelectSlotPage } from "../pages/SelectSlotPage.js";
import { DisplaySlotPage } from "../pages/DisplaySlotPage.js";
import { WaitForLockerPage } from "../pages/WaitForLockerPage.js";
import { WaitForClosePage } from "../pages/WaitForClosePage.js";
import { FinalPage } from "../pages/FinalPage.js";

import { createState } from "../core/core.js";
import { getAvailableSlots, performLockerAction, pollSlotClosed, resetLockerState } from "../services/api.js";

const [currentPage, setCurrentPage] = createState("selectAction");
const [selectedAction, setSelectedAction] = createState(null);
const [userSession, setUserSession] = createState(null);
const [selectedItem, setSelectedItem] = createState(null);
const [selectedSlot, setSelectedSlot] = createState(null);
const [pollingStarted, setPollingStarted] = createState(false);
const [otp, setOtp] = createState("");
const [availableSlots, setAvailableSlots] = createState([]);


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
      onSelect: async () => {
        const item = selectedItem();
        const rentalId = item.item_id;
        const action = selectedAction();

        if (selectedAction() == "DROP_OFF_BY_OWNER" || selectedAction() === "RETURN_BY_RENTER") {
          try {
            const slots = await getAvailableSlots(rentalId, action);
            setAvailableSlots(slots);
            setCurrentPage("selectSlot");
          } catch (e) {
            alert("빈 사물함 목록을 불러오지 못했습니다.");
            console.log(`Error Occured: ${e}`);
            resetStates();
          }
        } else {
          setCurrentPage("displaySlot");
        }
      },
    });
  }

  if (currentPage() === "selectSlot") {
    return SelectSlotPage({
      availableSlots: availableSlots(),
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
    const rentalId = selectedItem()?.item_id;
    const lockerId = selectedSlot();
    const action = selectedAction();

    performLockerAction({ rentalId, lockerId, action}).then(res => {
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
