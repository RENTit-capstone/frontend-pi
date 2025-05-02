import { FirstScreen } from "../pages/FirstScreen.js";
import { OTPScreen } from "../pages/OTPScreen.js";
import { ActionScreen } from "../pages/ActionScreen.js";
import { createState } from "../core/core.js";

const [currentPage, setCurrentPage] = createState("first");
const [selectedAction, setSelectedAction] = createState(null);
const [userSession, setUserSession] = createState(null);

const renderPage = () => {
  if (currentPage() === "first") {
    return FirstScreen({
      onSelect: (action) => {
        setSelectedAction(action);
        setCurrentPage("otp");
      },
    });
  }

  if (currentPage() === "otp") {
    return OTPScreen({
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
      data: userSession(),
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
