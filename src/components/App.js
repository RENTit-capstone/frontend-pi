import { SelectActionPage } from "../pages/SelectActionPage.js";
import { OTPPage } from "../pages/OTPPage.js";
import { SelectItemPage } from "../pages/SelectItemPage.js";
import { SelectSlotPage } from "../pages/SelectSlotPage.js";

import { ActionScreen } from "../pages/ActionScreen.js";

import { createState } from "../core/core.js";
import { performLockerAction } from "../services/api.js";

const [currentPage, setCurrentPage] = createState("selectAction");
const [selectedAction, setSelectedAction] = createState(null);
const [userSession, setUserSession] = createState(null);
const [selectedItem, setSelectedItem] = createState(null);
const [selectedSlot, setSelectedSlot] = createState(null);

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
        setCurrentPage("selectSlot")
      }
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
          setCurrentPage("openLocker")

        } else {
          alert("사물함 동작에 실패했습니다. 다시 시도해주세요.")
        }
        
      }
    });
  }

  if (currentPage() === "action") {
    return ActionScreen({
      action: selectedAction(),
      userName: userSession().user_name,
      items: userSession().items,
      availableSlots: userSession().available_slots,
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
