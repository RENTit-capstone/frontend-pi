import { SelectActionPage } from "../pages/SelectActionPage.js";
import { OTPPage } from "../pages/OTPPage.js";
import { ActionScreen } from "../pages/ActionScreen.js";
import { createState } from "../core/core.js";

const [currentPage, setCurrentPage] = createState("selectAction");
const [selectedAction, setSelectedAction] = createState(null);
const [userSession, setUserSession] = createState(null);

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
        setCurrentPage("action");
      },
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
