import { createState } from "../core/core.js";
import Button from "../components/Button.js";

const [phase, setPhase] = createState("select_item");
const [selectedItem, setSelectedItem] = createState(null);
const [selectedSlot, setSelectedSlot] = createState(null);

export const ActionScreen = ({ action, userName, items, availableSlots }) => {
    const renderItemSelection = () => {
        const buttons = items.map((item) => {
            const { html, handlers } = Button({
                id: `item-${item.item_id}`,
                lable: item.name,
                onClick: () => setSelectedItem(item)
            });
            return { html, handlers };
        });

        const nextButton = Button({
            id: "to-slot-select",
            label: "다음",
            onClick: () => setSelectedItem(item)
        });
        return {
            html: `
                <div class="screen-container">
                    <h2>${username}님, 물건을 선택하세요</h2>
                    ${buttons.map(b => b.html).join("")}
                    ${nextButton.html}
                </div>
            `,
            handlers: Object.assign({}, ...buttons.map(b => b.handlers), nextButton.handlers)
        };
    };

    const renderSlotSelection = () => {
        const buttons = availableSlots.map((slot) => {
            const { html, handlers } = Button({
                id: `slot-${slot}`,
                label: `${slot}번 칸`,
                onClick: () => setSelectedSlot(slot)
            });
            return { html, handlers };
        });

        const submitButton = Button({
            id: "confirm-perform",
            label: "확인",
            onClick: () => {
                console.log("실행: ", action, selectedItem(), selectedSlot());
                setPhase("done");
            }
        });

        return {
            html: `
                <div class="screen-container">
                    <h2>사용할 칸을 선택하세요</h2>
                    ${buttons.map(b  => b.html).join("")}
                    ${submitButton.html}
                </div>
            `,
            handlers: Object.assign({}, ...buttons.map(b => b.handlers), submitButton.handlers)
        };
    };

    const renderDone = () => {
        return {
            html: `
                <div class="screen-container">
                    <h2>작업이 완료되었습니다</h2>
                    <p>감사합니다, ${userName}닙!</p>
                </div>
            `,
            handlers: {}
        };
    };

    const views = {
        select_item: renderItemSelection,
        select_slot: renderSlotSelection,
        done: renderDone,
    };

    return views[phase()]()
};