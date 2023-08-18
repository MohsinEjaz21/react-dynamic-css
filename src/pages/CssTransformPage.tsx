import ButtonWidget from '@src/components/Widgets/ButtonWidget';
import { CssNamedColors, DemoCssTemplate } from '@src/mock';
import extractor from 'css-color-extractor';
import Color from 'easy-color';
import { useState } from "react";
import swal from 'sweetalert';
import './CssTransformPage.scss';

export const CssTransformPage = () => {

  const [inputCss, setInputCss] = useState(DemoCssTemplate[0]);
  const [outputCss, setOutputCss] = useState('');
  const [colorArr, setColorArr] = useState([]);
  const [fakeTemplateIndex, setFakeTemplateIndex] = useState(0);

  function handleTransform() {
    let tempCss = inputCss;
    let colorIndex = 1;
    let tempColorsArr: any = [];

    tempCss = replaceNamedColorWithHex(tempCss);
    let generatedContentArea: any = hideOutputCss();
    let tempColors = removeDuplicateAndSortColors(tempCss);

    // printColors(tempColors);

    ({ colorIndex, tempCss } = replaceColorWithVariableNameInCss(tempColors, colorIndex, tempCss, tempColorsArr));
    tempCss = replaceAll(tempCss, '@charset "utf-8";', '');
    tempCss = replaceAll(tempCss, '@charset "UTF-8";', '');

    showOutputCss(generatedContentArea);
    tempColorsArr.sort(sortColorByCountDesc);
    setOutputCss(tempCss);
    setColorArr(tempColorsArr);
  }

  return (
    <div className="container">
      <InputCssJsx inputCss={inputCss} setInputCss={setInputCss} fakeTemplateChange={fakeTemplateChange} ></InputCssJsx>
      <OutputCssJsx outputCss={outputCss} colorArr={colorArr} handleTransform={handleTransform} ></OutputCssJsx>
    </div>
  )

  function replaceColorWithVariableNameInCss(tempColors: any, colorIndex: number, tempCss: string, tempColorsArr: any) {
    tempColors.forEach((colorVal: any, index: number) => {
      let color = colorVal.replace(/\s/g, '');
      let currCssVar = `--color__${colorIndex}`;
      let colorName = `var(${currCssVar})`;
      let matchColorLen = (countMatchColors(tempCss, color) || []).length;
      let tempColorObj = {};
      let parser = new Color(colorVal);
      let rgbColor = parser.toRGBA();
      let hslaColor = parser.toHSLA();

      let foundColorIndex = tempColorsArr.findIndex(color => color.value == rgbColor.toString());
      foundColorIndex > -1 ? colorAlreadyDeclared() : declareNewColor()
      tempCss = replaceAll(tempCss, color, colorName);

      function colorAlreadyDeclared() {
        currCssVar = tempColorsArr[foundColorIndex]['key'];
        colorName = `var(${currCssVar})`;
        tempColorsArr[foundColorIndex]['count'] = tempColorsArr[foundColorIndex]['count'] + matchColorLen;
      }

      function declareNewColor() {
        tempColorObj['key'] = currCssVar;
        tempColorObj['rgba'] = rgbColor;
        tempColorObj['original'] = colorVal;
        tempColorObj['count'] = matchColorLen;
        tempColorObj['hsla'] = hslaColor;
        tempColorsArr.push(tempColorObj);
        colorIndex++;
      }
    });
    return { colorIndex, tempCss };
  }

  function removeDuplicateAndSortColors(tempCss: string) {
    let tempColors = extractor.fromCss(tempCss).filter((colorVal: any) => colorVal !== '0');
    tempColors = makeArrayUnique(tempColors);
    let hexColors = tempColors.filter((colorVal: any) => colorVal.indexOf('#') !== -1);
    let otherThanHexColors = tempColors.filter((colorVal: any) => colorVal.indexOf('#') == -1);
    hexColors.sort((a, b) => b.length - a.length);
    tempColors = [...hexColors, ...otherThanHexColors];
    return tempColors;
  }

  function replaceNamedColorWithHex(tempCss: string) {
    let namedColors = Object.keys(CssNamedColors);

    tempCss = tempCss.split('\n').map(line => {
      if (line.indexOf(':') > -1
        && line.indexOf('{') === -1
        && line.indexOf(':hover') === -1
        && line.indexOf(':active') === -1
        && line.indexOf(':visited') === -1
        && line.indexOf(':focus') === -1) {
        let secondPart = line.substring(line.indexOf(':') + 1);

        if ((secondPart.indexOf('rgb') > -1 || secondPart.indexOf('hsla') > -1) && secondPart.indexOf(',') > -1) {
          line = replaceAll(line, ', ', ',');
          line = replaceAll(line, ' ,', ',');
        }

        namedColors.forEach(color => {
          let exactMatchRegex = new RegExp('\\b' + color + '\\b');
          let endWithHyphenRegex = new RegExp('\\b' + color + '-' + '\\b');
          let startWithHyphenRegex = new RegExp('\\b' + '-' + color + '\\b');

          if (secondPart.match(exactMatchRegex)
            && !secondPart.match(endWithHyphenRegex)
            && !secondPart.match(startWithHyphenRegex)) {
            line = replaceAll(line, color, CssNamedColors[color]);
          }
        });

      }
      return line;
    }).join('\n');
    return tempCss;
  }

  function fakeTemplateChange() {
    let fakeIndex = fakeTemplateIndex;
    if (fakeIndex == DemoCssTemplate.length - 1) {
      fakeIndex = 0;
    } else {
      fakeIndex++;
    }
    setFakeTemplateIndex(fakeIndex);
    setInputCss(DemoCssTemplate[fakeIndex])
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function replaceAll(str, find, replace) {
    return str.replaceAll(find, replace);
  }

  function countMatchColors(str, find) {
    return str.match(new RegExp(escapeRegExp(find), 'g'));
  }

  function makeArrayUnique(arr) {
    return arr.filter((item, pos) => arr.indexOf(item) == pos)
  };

  function sortColorByCountDesc(a, b) {
    var countA = a.count;
    let countB = b.count;
    if (countA < countB) return 1;
    if (countA > countB) return -1;
    return 0;
  }

  function showOutputCss(generatedContentArea: any) {
    setTimeout(() => {
      if (generatedContentArea) {
        generatedContentArea.style.opacity = '1';
      }
    }, 200);
  }

  function hideOutputCss() {
    let generatedContentArea: any = document.querySelector('div.right-section > pre');
    if (generatedContentArea) {
      generatedContentArea.style.opacity = '0';
    }
    return generatedContentArea;
  }
}

function InputCssJsx(props) {
  return (

    <div className="left-section gradient-box">
      <div className="left-section--header" >
        <h1 className="heading-primary gradient_animated_text">Enter Your CSS</h1>
        <div className="action-btns">
          <ButtonWidget onClick={props.fakeTemplateChange}>
            Use Fake CSS
          </ButtonWidget>
          <ButtonWidget onClick={() => props.setInputCss('/* Paste Your Css */')}>
            Paste Your CSS
          </ButtonWidget>
        </div>
      </div>
      <div className="left-section--content" >
        <div className="left-section--content--textarea" contentEditable="true"
          onBlur={e => props.setInputCss(e.target.innerText)}
            suppressContentEditableWarning={true}
          />
        {/* <textarea className="left-section--content--textarea" value={props.inputCss} onChange={e => props.setInputCss(e.target.value)} /> */}
      </div>

    </div>

  );
}

function OutputCssJsx(prop) {
  const { colorArr, handleTransform, outputCss } = prop;

  return (
    <div className="right-section gradient-box">
      <div className="right-section--header" >
        <h1 className="heading-primary gradient_animated_text">
          Dynamic CSS
        </h1>
        <div className="action-btns">
          <ButtonWidget onClick={handleTransform} kind={'cancel'}>
            Make CSS Beutiful
          </ButtonWidget>
          <ButtonWidget onClick={copyToClipBoardOutputCss}>
            Copy New CSS
          </ButtonWidget>
        </div>
      </div>
      <div className="right-section--content">
        <pre id="finalContent" className="generated-css content-area slideInRight">
          {outputCss.length > 0 && (
            <>
              {outputCssNotePoint()}
              {<div>{`:root { \n`} </div>}
              {renderColors('original')}<br />
              {renderColors('rgba')}<br />
              {renderColors('hsla')}<br />

              {<div>{`}`} </div>}
            </>
          )}
          {JSON.parse(JSON.stringify(outputCss, null, 2))}
        </pre>
      </div>
    </div>);

  function copyToClipBoardOutputCss() {
    var copyText = document.getElementById("finalContent");
    navigator.clipboard.writeText(copyText!.innerText)
    swal({
      title: "Copied!",
      text: "Your CSS is copied to clipboard",
      icon: "success",
      timer: 1000,
      buttons: [false]
    });
  }

  function outputCssNotePoint() {
    return <><div className="alert-message">
      {`/* ColorLength is ${colorArr.length} \n Note Point :: Named colors are transform into \n respective hex format to avoid color repetition \n Original Colors are below */ `}
    </div><br /></>
  }

  function renderColors(type) {

    return (<>
      <div className="alert-message">
        {`/* ===============================  \n if you like ${type} colors formate \n use below ⬇️ \n ===============================  */ \n`}
      </div><br />

      {colorArr.map((color: any, index) => {
        return <>
          <div key={index} className="color-variables floatLeft">
            {color.key}: {color[type]};
          </div>
          <div>
            {` /*  ${color.count} */`}
          </div>
        </>;
      })}

    </>)

  }
}

// =============
// Xtra Logs
// =============

function tempLogs(line) {
  if (line.indexOf('url(https://1.www.s81c.com/common/v17e/i/buttons/btn-sprite.png) no-repeat 0 0 transparent') > -1) {
    console.log(`
    line: ${line}
    ${line.indexOf(':')}
    ${line.indexOf('{')}
    ${line.indexOf(':hover')}
    ${line.indexOf(':active')}
    ${line.indexOf(':visited')}
    ${line.indexOf(':focus')}
    ${line.substring(line.indexOf(':') + 1)}
    `)
  }
}

function printColors(tempColors) {
  tempColors.forEach((colorVal: any, index) => {
    console.log(`new_color_${index}`, colorVal);
  })
}
