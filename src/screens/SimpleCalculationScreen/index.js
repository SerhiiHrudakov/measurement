/**
 * Created by Serhiy on 11/12/18
<<<<<<< HEAD
=======
 * SimpleCalculationScreen component
>>>>>>> simple-calculation
 */

import React from 'react';

// libraries
// import PropTypes from 'prop-types';
import _ from 'lodash';

import { ampsFromWattAndCurrent } from '../../logics/electronics';

// components
import { InputField, DropDownSelect, BatteryPackView } from './../../components';

// constants
import { BATTERIES_TYPES_LIST, BATTERIES_FORMAT_LIST, VIEW_TYPE, POSITION } from './../../constants';

// import './styles.scss';

export default class extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);

    this.state = {
      powerValue: 1500,
      currentValue: 48,
      batteryTypeId: null,
      batteryFormatId: null,
      batteryValue: 3000,
      pValue: undefined,
      sValue: undefined,
      calculateButteriesAmount: 0,
    };
  }

  setData(key, value) {
    const nValue = Number(value);

    if (key === 'batteryTypeId' && !nValue) {
      this.setState({
        batteryFormatId: null,
        [key]: nValue,
      })
    } else {
      this.setState({
        [key]: nValue,
      })
    }
  }

  getBatteriesFormatList(typeId) {
    return _.filter(BATTERIES_FORMAT_LIST, (item) => {
      const { types } = item;
      return _.includes(types, Number(typeId));
    });
  }

  getDataFromId(array, id) {
    return _.find(array, (item) => item.id === id);
  }

  testFunc() {
    const array = [0,1,2,4,5,8,6];

    let res1 = '';

    for(let i = 0; i < array.length; i += 1) {
      res1 += array[i].toString();

      if (i + 1 < array.length && ((!(array[i] % 2) || array[i] === 0) && !(array[i + 1] % 2))) {
        res1 += '-';
      }
    }

    // i + 1 < array.length && ((!(item % 2) || item === 0) && !(array[i + 1] % 2))

    console.log(res1);

    const res = array.map((item, i) => {
      if(i + 1 < array.length && ((!(item % 2) || item === 0) && !(array[i + 1] % 2))) {
        return item + '-';
      }

      return item;
    }).join('');

    console.log(res);
  }

  calculatePack() {
    const { powerValue, currentValue, batteryValue, batteryTypeId } = this.state;
    const batteryObj = this.getDataFromId(BATTERIES_TYPES_LIST, batteryTypeId);
    const { info } = batteryObj;
    const { volts } = info;

    const maxAh = ampsFromWattAndCurrent(powerValue, currentValue);
    const sValue = Math.round(currentValue / volts.nom);
    const pValue = Math.round(maxAh / (batteryValue / 1000));
    const calculateButteriesAmount = sValue * pValue;
    console.log(calculateButteriesAmount);

    this.setState({
      pValue,
      sValue,
      calculateButteriesAmount
    });
  }

  parametersValidator() {
    const { powerValue, currentValue, batteryValue, batteryTypeId, batteryFormatId } = this.state;

    return !(powerValue && currentValue && batteryValue && batteryTypeId !== null && batteryFormatId !== null);
  }

  render() {
    const { batteryTypeId, batteryFormatId, pValue, sValue } = this.state;
    const batteriesFormatList = this.getBatteriesFormatList(batteryTypeId);
    const n = 1;

    return (
      <div className="SimpleCalculationScreenContainer">
        <InputField label={'Power (Watt/H)'} placeholder={'Input power value for target device'} onInput={(text) => this.setData('powerValue', text)}/>
        <InputField label={'Current (Volts)'} placeholder={'Input current value for target device'} onInput={(text) => this.setData('currentValue', text)}/>
        <DropDownSelect label={'Choose your battery type'} dataList={BATTERIES_TYPES_LIST} onChange={(type) => this.setData('batteryTypeId', type)}/>
        <DropDownSelect label={'Choose your battery format'} dataList={batteriesFormatList} onChange={(format) => this.setData('batteryFormatId', format)}/>
        <InputField label={'Battery volume (mA)'} placeholder={'Input single battery volume in mA (XXXX)'} onInput={(text) => this.setData('batteryValue', text)}/>
        <button disabled={this.parametersValidator()} onClick={() => this.calculatePack()}>Calculate</button>
        { pValue && sValue && (
          <BatteryPackView id={n}
                           visible
                           viewType={VIEW_TYPE.TOP}
                           viewPosition={POSITION.VERTICAL}
                           typeId={batteryTypeId}
                           formatId={batteryFormatId}
                           sValue={sValue}
                           pValue={pValue}
                           packNumber={1} />
        )}
      </div>
    );
  }
}

//
// 1. Потужність приладу що буде використовувати акамулятор (Ватт/годину - Watt/h) = 1500
//
// 2. Величина робочої напруги (Вольт - V) = 24V
//
// 3. Номінальна сила струму (Ампер/A) = 1500/24 = 62,5A
//
// 3. Тип акамулятора Li-Ion
//
// - напруга зар/ном/розр = 4,2/3,6/2,8
//
// - потужність 2500mAh
//
// - максимальний струм 20A
//
// 4. Формфактор мм(діаметр/висота) - 18/650

// тормозити виконання важконавантаженного потоку по сигналу контроллера. Таким чином буде можливо керування швидкодією
// программи, і продовжувати вчасно реагувати на дії юзера. Фактично в будь який момент інтеракції, программа може
// призупинити виконання потоку що відбувається в бекграунді. І одразу ж підключитись для обробки операції на відповідь
// у дії користувача. Звісно, цей імпрувмент як один з варіантів пришвидшення роботи программи на етапі завантаження(старту).

// Я вирішив не використовувати підхід за ReactNative у випадку з React. Структура файлів та мопонентів буде застосовуватись,
// але стилі будуть *.scss формату, так як рівень підказок у випадку з JS проектом для стилів, вищій.
// АЛЕ! У випадку якщо проект розробляється у двох версіях (мобільний та браузерний варіант), доцільніше буде описувати стилі
// для деяких компонентів у одному стилі. В такому випадку підхід ReactNative для стилів вважається вірним у застосуванні.
// Також, при застосуванні scss формату стилів, можна інкапсулювати найпростіші стилі у назві компоненту (що фактично рахується
// сумішю ReactNative та стандартного підходу для будови та написання стилів.

// на данний момент варіант з розрахунком не циліндричного формату батарей буде відкладений на майбутнє. Такий вид розрахунку
// поки що не є необхідним функціоналом
