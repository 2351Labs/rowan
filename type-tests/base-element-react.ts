import type { RowanElementProperties } from "@rowan-ui/core/react";
import type { RowanTextField } from "@rowan-ui/core/text-field";
import type { BaseElement } from "../src/lib/base-element.js";

type Assert<T extends true> = T;

type BaseElementHasValidity = Assert<"validity" extends keyof BaseElement ? true : false>;
type BaseElementHasSetCustomValidity = Assert<
  "setCustomValidity" extends keyof BaseElement ? true : false
>;
type TextFieldPropertiesOmitValidity = Assert<
  "validity" extends keyof RowanElementProperties<RowanTextField> ? false : true
>;
type TextFieldPropertiesOmitSetCustomValidity = Assert<
  "setCustomValidity" extends keyof RowanElementProperties<RowanTextField> ? false : true
>;

void (null as unknown as BaseElementHasValidity);
void (null as unknown as BaseElementHasSetCustomValidity);
void (null as unknown as TextFieldPropertiesOmitValidity);
void (null as unknown as TextFieldPropertiesOmitSetCustomValidity);
