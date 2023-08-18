import { observable, observe } from "@legendapp/state";
import { GlobalSlice } from "@src/store/global.slice";

export const store$ = observable(structuredClone(GlobalSlice));

observe(() => {
  console.log('store$', store$.get())
})