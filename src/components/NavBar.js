let intervalId = null;

export default function NavBar({ onReset, currentPage }) {
  let remainingTime = 60;
  
  const nonResettablePages = ["selectAction", "displaySlot", "waitForLocker", "waitForClose"];

  const canReset = !nonResettablePages.includes(currentPage());

  const updateCountdownText = () => {
    const timerElement = document.getElementById("idle-timer");
    if (timerElement && canReset) {
      timerElement.textContent = `자동 초기화까지 ${remainingTime}초 남음`;
    }
  };

  const clearInactivityTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const initInactivityTimer = () => {
    clearInactivityTimer();
    remainingTime = 60;
    updateCountdownText();

    intervalId = setInterval(() => {
      remainingTime--;
      updateCountdownText();

      if (remainingTime <= 0) {
        clearInactivityTimer();
        onReset();
      }
    }, 1000);
  };

  const attachUserActivityListeners = () => {
    ["click", "mousemove", "keydown"].forEach(event =>
        window.addEventListener(event, initInactivityTimer)
    );
  };

  const detachUserActivityListeners = () => {
    ["click", "mousemove", "keydown"].forEach(event =>
        window.removeEventListener(event, initInactivityTimer)
    );
  };

  detachUserActivityListeners();
  clearInactivityTimer();

  if (canReset) {
    attachUserActivityListeners();
    initInactivityTimer();
  }

  return {
    html: `
      <div class="nav-bar">
        <div class="nav-left">
          ${canReset ? `<span id="idle-timer">자동 초기화까지 60초 남음</span>`: ""}
        </div>
        <div class="nav-right">
          <button id="reset-button" class="nav-button" ${canReset ? "" : "disabled"} title="${canReset ? "" : "현재 상태에서는 초기화할 수 없습니다."}">
            초기화
          </button>
        </div>
      </div>
    `,
    handlers: canReset
      ? {
          "reset-button" : () => {
            clearInactivityTimer();
            detachUserActivityListeners();
            onReset();
          }
        }
      : {}
  };
}