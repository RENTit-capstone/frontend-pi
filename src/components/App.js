import { FirstScreen } from '../pages/FirstScreen.js';
import { OTPScreen } from '../pages/OTPScreen.js';
import { createState } from '../core/core.js';

const [currentPage, setCurrentPage] = createState("first");
const [selectedAction, setSelectedAction] = createState(null);

const renderPage = () => {
  switch (currentPage()) {
    case "first":
      return FirstScreen({
        onSelect: (action) => {
          setSelectedAction(action);
          setCurrentPage("otp");
        }
      });

    case "otp":
      return OTPScreen({
        action: selectedAction()
      });

    default:
      return {
        html: `<div>페이지를 찾을 수 없습니다</div>`,
        handlers: {}
      };
  }
};

export default function App() {
  const page = renderPage();

  return {
    html: `
      <div>
        ${page.html}
      </div>
    `,
    handlers: {
      ...page.handlers,
    }
  };
}