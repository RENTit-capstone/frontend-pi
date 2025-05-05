import { createState } from "../core/core.js";

const [phase, setPhase] = createState("select_item");

export const ActionScreen = ({ userName }) => {
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
        done: renderDone,
    };

    return views[phase()]()
};