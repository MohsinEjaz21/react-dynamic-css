
export const UIShellWrapper = (props) => {
  return (
    <div className="app">
      <div className="app__header">
        <img src="/assets/img/logo.svg" alt="logo" className="app__logo" />
      </div>

      <div className="app__content">
        <div className="app__container">
          {props.children}
        </div>

        {/* <div className="app__footer">
          <p>Raw-css-colors</p> <IconRight/> <p>Dynamic-css-colors</p>
        </div> */}
      </div>
    </div>
  );
};
