export default function NavBar({ onReset }) {
    return {
        html: `
            <div class="nav-bar">
                <button id="reset-button" class="nav-button">취소</button>
            </div>
        `,
        handlers: {
            "reset-button": onReset
        }
    }
}