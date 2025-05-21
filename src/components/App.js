import { SelectActionPage } from "../pages/SelectActionPage.js";
import { OTPPage } from "../pages/OTPPage.js";
import { SelectItemPage } from "../pages/SelectItemPage.js";
import { SelectSlotPage } from "../pages/SelectSlotPage.js";
import { DisplaySlotPage } from "../pages/DisplaySlotPage.js";
import { WaitForLockerPage } from "../pages/WaitForLockerPage.js";
import { WaitForClosePage } from "../pages/WaitForClosePage.js";
import { FinalPage } from "../pages/FinalPage.js";
import NavBar from "./NavBar.js";

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
const [selectedFee, setSelectedFee] = createState(0);
const [firstState, setFirstState] = createState(true);

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
    if (firstState()) {
      resetStates();
      setFirstState(false);
    }
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
        console.log("[DEBUG] ", item);
        // TODO: FIX BELOW
        const rentalId = selectedItem().rental_id;
        const action = selectedAction();

        if (!item.payable) {
          alert("현재 잔액이 부족하여 이 물건을 사용할 수 없습니다.");
          resetStates();
          return;
        }

        setSelectedFee(item.fee);

        if (["DROP_OFF_BY_OWNER", "RETURN_BY_RENTER"].includes(action)) {
          try {
            const slots = await getAvailableSlots(rentalId, action);
            console.log("[DEBUG] API results:", slots);
            setAvailableSlots(slots);
            setCurrentPage("selectSlot");
          } catch (e) {
            alert("빈 사물함 목록을 불러오지 못했습니다.");
            console.log(`Error Occured: ${e}`);
            resetStates();
          }
        } else {
          const lockerId = item.slot;
          console.log("[DEBUG] Current locker id:", lockerId);
          if (!lockerId) {
            alert("해당 물건은 현재 사물함에 없습니다.\n다른 키오스크에서 찾거나, 물건 대여자에게 문의하세요.");
            resetStates();
            return;
          }

          setSelectedSlot(lockerId);
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
        // where to use down below?
        //const locker = availableSlots().find(l => l.lockerId === selectedSlot());
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
    const rentalId = selectedItem().rental_id;
    const lockerId = selectedSlot();
    const action = selectedAction();

    performLockerAction({
      rentalId,
      lockerId,
      action,
      fee: selectedFee()
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

const nonResettablePages = ["waitForLocker", "waitForClose"];

export default function App() {
  const page = renderPage();

  const isResetAllowed = !nonResettablePages.includes(currentPage());

  const nav = NavBar({
    onReset: () => resetStates(),
    canReset: isResetAllowed,
  });

  return {
    html: `
      ${nav.html}
      <div>${page.html}</div>
    `,
    handlers: {
      ...nav.handlers,
      ...page.handlers
    },
  };
}
