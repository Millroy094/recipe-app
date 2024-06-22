describe("Recipe tests", () => {
  it.only(`Given I have a new recipe
      When I add the new recipe name
      And ingredients
      And measurements
      And cooking method
      Then the new recipe is saved for later`, () => {
    cy.visit("http//:localhost:3000");

    // expect(true).to.eq(false);
  });

  it(`Given I want to look for a recipe
      When I search by the name of the recipe
      Then I find the recipe
      And I can see the ingredients
      And I can see the cooking methods`, () => {
    expect(true).to.eq(false);
  });

  it(`Given I want to look for a recipe by ingredients
      When I search by the ingredient of the recipe
      Then I find the recipe
      And I can see the ingredients
      And I can see the cooking methods`, () => {
    expect(true).to.eq(false);
  });
});
