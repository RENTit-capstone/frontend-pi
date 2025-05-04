import { createState } from "../core/core.js";
import Button from "../components/Button.js";
import { performLockerAction } from "../services/api.js"

const [phase, setPhase] = createState("select_item");
const [selectedItem, setSelectedItem] = createState(null);
const [selectedSlot, setSelectedSlot] = createState(null);

export const ActionScreen = ({ action, userName, items, availableSlots }) => {
    const renderItemSelection = () => {
        const itemButtons = items.map((item) => {
            const { html, handlers } = Button({
                id: `item-${item.item_id}`,
                label: item.name,
                onClick: () => setSelectedItem(item)
            });
            return { html, handlers };
        });

        const { html: nextHtml, handlers: nextHandlers } = Button({
            id: "to-slot-select",
            label: "다음",
            onClick: () => {
                if (selectedItem()) {
                    setPhase("select_slot");
                }
            },
        });
        return {
            html: `
                <div class="screen-container">
                    <h2>${userName}님, 물건을 선택하세요</h2>
                    ${itemButtons.map(b => b.html).join("")}
                    <div class="action-button-wrapper">${nextHtml}</div>
                </div>
            `,
            handlers: Object.assign({}, ...itemButtons.map(b => b.handlers), nextHandlers),
        };
    };

    const renderSlotSelectionStoreOrReturn = () => {
        const slotButtons = availableSlots.map((slot) => {
            const { html, handlers } = Button({
                id: `slot-${slot}`,
                label: `${slot}번 칸`,
                onClick: () => setSelectedSlot(slot)
            });
            return { html, handlers };
        });

        const { html: confirmHtml, handlers: confirmHandlers } = Button({
            id: "confirm-perform",
            label: "확인",
            onClick: () => {
                console.log("실행 요청:", action, selectedItem(), selectedSlot());
                setPhase("done");
            }
        });

        return {
            html: `
                <div class="screen-container">
                    <h2>사용할 칸을 선택하세요</h2>
                    ${slotButtons.map(b  => b.html).join("")}
                    <div class="action-button-wrapper">${confirmHtml}</div>
                </div>
            `,
            handlers: Object.assign({}, ...slotButtons.map((b) => b.handlers), confirmHandlers)
        };
    };

    const renderSlotDisplayBorrowOrRetrieve = () => {
        const slot = selectedItem()?.slot;
        const slotInfo = slot ? `${slot}번 칸에서 꺼내주세요` : "다른 사물함에 있습니다.";

        const { html: confirmHtml, handlers: confirmHandlers } = Button({
            id: "confirm-perform",
            label: "확인",
            onClick: () => {
                console.log("실행 요청:", action, selectedItem(), slot);
                setPhase("done");
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