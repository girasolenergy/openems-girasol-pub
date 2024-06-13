import { LINE_INFO } from "src/app/shared/edge/edgeconfig.spec";
import { OeFormlyViewTester } from "src/app/shared/genericComponents/shared/testing/tester";
import { sharedSetup, TestContext } from "src/app/shared/test/utils.spec";

import { ModalComponent } from "./modal";

export const VIEW_CONTEXT: OeFormlyViewTester.Context = ({});

export function expectView(testContext: TestContext, viewContext: OeFormlyViewTester.Context, view: OeFormlyViewTester.View): void {

  const generatedView = OeFormlyViewTester.apply(ModalComponent.generateView(testContext.translate), viewContext);

  expect(generatedView).toEqual(view);
};

describe('SelfConsumption - Modal', () => {
  let TEST_CONTEXT: TestContext;
  beforeEach(async () => TEST_CONTEXT = await sharedSetup());

  it('generateView()', () => {
    {
      expectView(TEST_CONTEXT, VIEW_CONTEXT, {
        title: "自己消費",
        lines: [
          LINE_INFO("自己消費は、現在発電された出力のうち、直接消費とストレージ負荷自体に使用できる割合を示します。"),
        ],
      });
    }
  });
});
