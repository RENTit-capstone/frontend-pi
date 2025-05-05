import { SelectActionPage } from "../pages/SelectActionPage.js";
import { OTPPage } from "../pages/OTPPage.js";
import { SelectItemPage } from "../pages/SelectItemPage.js";
import { SelectSlotPage } from "../pages/SelectSlotPage.js";
import { DisplaySlotPage } from "../pages/DisplaySlotPage.js";
import { WaitForClosePage } from "../pages/WaitForClosePage.js";
import { FinalPage } from "../pages/FinalPage.js";

import { createState } from "../core/core.js";
import { performLockerAction, checkSlotClosed } from "../services/api.js";

const [currentPage, setCurrentPage] = createState("selectAction");
const [selectedAction, setSelectedAction] = createState(null);
const [userSession, setUserSession] = createState(null);
const [selectedItem, setSelectedItem] = createState(null);
const [selectedSlot, setSelectedSlot] = createState(null);

const resetStates = () => {
  setCurrentPage("selectAction");
  setSelectedAction(null)
  setUserSession(null)
  setSelectedItem(null)
  setSelectedSlot(null)
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
          setCurrentPage("selectSlot")
        } else {
          setCurrentPage("displaySlot")
        }
      },
    });
  }

  if (currentPage() === "selectSlot") {
    return SelectSlotPage({
      availableSlots: userSession().available_slots,
      selectedSlot: selectedSlot,
      setSelectedSlot: setSelectedSlot,
      onSelect: async () => {
        const res = await performLockerAction({
          action: selectedAction(),
          item: selectedItem(),
          slot: selectedSlot(),
        });
        if (res.success) {
          setCurrentPage("waitForClose");
        } else {
          alert("사물함 동작에 실패했습니다. 다시 시도해주세요.")
        }
      },
    });
  }

  if (currentPage() === "displaySlot") {
    return DisplaySlotPage({
      userName: userSession().user_name,
      selectedItem: selectedItem(),
      onConfirm: async (slotNum) => {
        const res = await performLockerAction({
          action: selectedAction(),
          item: selectedItem(),
          slot: slotNum,
        });
        if (res.success) {
          setCurrentPage("waitForClose");
        } else {
          alert("사물함 동작에 실패했습니다. 다시 시도해주세요.");
        }
      },
    });
  }

  let pollingStarted = false;
  if (currentPage() === "waitForClose") {
    if (!pollingStarted) {
      pollingStarted = true;
      setTimeout(async () => {
        let retries = 0;
        const maxRetries = 10;
        const interval = 1000;
        let closed = false;

        while (retries < maxRetries) {
          const result = await checkSlotClosed();
          console.log("[POLL] 닫힘 상태:", result.closed);
          if (result.closed) {
            closed = true;
            break;
          }
          retries++;
          await new Promise(res => setTimeout(res, interval));
        }

        if (closed) {
          setCurrentPage("final");
        } else {
          if (["store", "return"].includes(selectedAction())) {
            alert("사물함의 닫힘이 감지되지 않습니다. 다른 칸에 다시 맡겨주세요.");
          }
          resetStates();
        }
        pollingStarted = false;
      }, 0);
    }
    return WaitForClosePage({
      userName: userSession().user_name,
      slot: selectedSlot(),
    });
  }

  if (currentPage() === "final") {
    return FinalPage({ userName: userSession().user_name });
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
