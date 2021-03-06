// @flow
import * as $ from "../../index";

const shopItemsSelector = state => state.shop.items;
const taxPercentSelector = state => state.shop.taxPercent;

const subtotalSelector = $.map(
  items => items.reduce((acc, item) => acc + item.value, 0),
  shopItemsSelector
);

const calculateTax = (subtotal, taxPercent) => subtotal * (taxPercent / 100);
const taxSelector = $.apAll(
  $.constant(calculateTax),
  subtotalSelector,
  taxPercentSelector
);

const totalSelector = $.apAll(
  $.constant((subtotal, tax) => ({ total: subtotal + tax })),
  subtotalSelector,
  taxSelector
);
