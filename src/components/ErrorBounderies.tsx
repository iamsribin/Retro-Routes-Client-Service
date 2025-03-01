
import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.log(error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
    // Log to a service or store the error info in the state for further use
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <style>
            {`
            @import url('https://fonts.googleapis.com/css?family=Lato|Roboto+Slab');

            * {
              position: relative;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            .centered {
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }

            h1 {
              margin-bottom: 50px;
              font-family: 'Lato', sans-serif;
              font-size: 50px;
            }

            .message {
              font-family: 'Roboto Slab', serif;
              font-size: 30px;
              color: #000000;
            }
            `}
          </style>
          
          <div className="centered">
            <h1>500 Server Error</h1>
            <div className="container">
              <span className="message" id="js-whoops"></span>
              <span className="message" id="js-appears"></span>
              <span className="message" id="js-error"></span>
              <span className="message" id="js-apology"></span>
              <div><span className="hidden" id="js-hidden" style={{ color: 'white' }}>Message Here</span></div>
            </div>
            <script>
              {`
              const messages = [
                ['Whoops.', 'Oops.', 'Excuse me.', 'Oh Dear.', 'Well poo.', 'Hm...', 'This is awkward.', 'Well gosh!'],
                ['It appears', 'Looks like', 'Unfortunately,', 'It just so happens', 'Sadly,', 'Seemingly from nowhere'],
                ['there was an error.', 'we goofed up.', 'a bad thing happened.', 'the server crashed.', 'a bug appeared.', 'someone did a naughty.', 'pixies got into the server!', 'the server threw a tantrum.', 'the website had a bad day.', 'our code pooped out.'],
                ['Sorry.', 'Apologies.', 'Our bad.', 'Sad day.', 'We are quite contrite.', 'Beg pardon.']
              ];

              document.addEventListener('DOMContentLoaded', () => {
                const messageElements = [
                  document.querySelector('#js-whoops'),
                  document.querySelector('#js-appears'),
                  document.querySelector('#js-error'),
                  document.querySelector('#js-apology')
                ];

                const widthElement = document.querySelector('#js-hidden');
                let lastMessageType = -1;
                let messageTimer = 4000;

                function setupMessages() {
                  messageElements.forEach((element, index) => {
                    if (element) {
                      let newMessage = getNewMessage(index);
                      element.innerHTML = newMessage;
                      calculateWidth(element, newMessage);
                    }
                  });
                }

                function calculateWidth(element, message) {
                  widthElement.innerText = message;
                  let newWidth = widthElement.getBoundingClientRect().width;
                  element.style.width = \`\${newWidth}px\`;
                }

                function swapMessage() {
                  messageElements.forEach((element, index) => {
                    let newMessage = getNewMessage(index);
                    element.style.opacity = 0;
                    setTimeout(() => {
                      calculateWidth(element, newMessage);
                      element.innerHTML = newMessage;
                    }, 200);
                    setTimeout(() => {
                      element.style.opacity = 1;
                    }, 400);
                  });
                }

                function getNewMessage(index) {
                  const messagesArray = messages[index];
                  let newMessageIndex = Math.floor(Math.random() * messagesArray.length);
                  while (lastMessageType === newMessageIndex) {
                    newMessageIndex = Math.floor(Math.random() * messagesArray.length);
                  }
                  lastMessageType = newMessageIndex;
                  return messagesArray[newMessageIndex];
                }

                setupMessages();
                setInterval(swapMessage, messageTimer);
              });
              `}
            </script>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
