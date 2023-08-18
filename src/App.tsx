
import { AppWrapper } from '@src/components/Wrapper/AppWrapper';
import { CssTransformPage } from '@src/pages/CssTransformPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
        <AppWrapper>
          <Routes>
            <Route path="/" element={<CssTransformPage />} />
          </Routes>
        </AppWrapper>
    </BrowserRouter>
  );
}

export default App;
