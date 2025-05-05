import { createState } from "../core/core.js";
import Button from "../components/Button.js";
import { performLockerAction } from "../services/api.js"

const [phase, setPhase] = createState("select_item");
const [selectedItem, setSelectedItem] = createState(null);
const [selectedSlot, setSelectedSlot] = createState(null);

export const ActionScreen = ({ action, userName }) => {
    const renderSlotDisplayBorrowOrRetrieve = () => {
        const slot = selectedItem()?.slot;
        const slotInfo = slot ? `${slot}번 칸에서 꺼내주세요` : "다른 사물함에 있습니다.";

        const { html: confirmHtml, handlers: confirmHandlers } = Button({
            id: "confirm-perform",
            label: "확인",
            onClick: async () => {
                console.log("실행 요청:", action, selectedItem(), slot);
                const res = await performLockerAction({
                    action: action,
                    item: selectedItem,
                    slot: slot
                });
                if (res.success) {
                    setPhase("done");
                } else {
                    alert("사물함 동작에 실패했습니다. 다시 시도해주세요.")
                }
            }
        });

        return {
            html: `
                <div class="screen-container">
                    <h2>선택한 물건의 위치</h2>
                    <p>${slotInfo}</p>
                    <div class="action-button-wrapper">${confirmHtml}</div>
                </div>
            `,
            handlers: confirmHandlers
        };
    };

    const renderSlotSelection = () => {
        if (action === "store" || action === "return") {
            return renderSlotSelectionStoreOrReturn();
        } else if (action === "borrow" || action === "retrieve") {
            return renderSlotDisplayBorrowOrRetrieve();
        }
    };

    const renderDone = () => {
        return {
            html: `
                <div class="screen-container">
                    <h2>작업이 완료되었습니다</h2>
                    <p>감사합니다, ${userName}님!</p>
                </div>
            `,
            handlers: {},
        };
    };

    const views = {
        select_item: renderItemSelection,
        select_slot: renderSlotSelection,
        done: renderDone,
    };

    return views[phase()]()
};