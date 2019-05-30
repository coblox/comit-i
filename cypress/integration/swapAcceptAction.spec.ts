/// <reference types="Cypress" />

describe("The Accept action", () => {
  it("should display a button for the accept action", () => {
    cy.server();
    cy.route("http://localhost:8000/swaps", "fixture:swapWithAccept.json");

    cy.visit("/show_resource/swaps");

    cy.get("[data-cy=accept-button]").should("exist");
  });

  it("should show a dialog for the action fields if button is clicked", () => {
    cy.get("[data-cy=accept-button]").click();

    cy.get("[data-cy=dialog]").should("exist");
  });
});
