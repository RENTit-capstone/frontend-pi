import { FirstScreen } from '../pages/FirstScreen.js'

export default function App() {
  const FirstScreenComponent = FirstScreen(); 
  return {
    html: `
      <div>
        ${FirstScreenComponent.html}
      </div>
    `,
    handlers: {
      ...FirstScreenComponent.handlers,
    }
  };
}
