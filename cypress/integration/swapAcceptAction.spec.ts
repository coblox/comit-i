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

  it("should not allow to submit the form without filling all fields", () => {
    // if there are fields
    cy.get("[data-cy=dialog]")
      .find("[data-cy=action-text-field]")
      .should("exist");

    // submitting the dialog should not close it
    cy.get("[data-cy=dialog]")
      .find("[data-cy=ok-button]")
      .click();

    cy.get("[data-cy=dialog]").should("exist");
  });

  it("should close the dialog when clicking close", () => {
    cy.get("[data-cy=dialog]")
      .find("[data-cy=close-button]")
      .click();
    cy.get("[data-cy=dialog]").should("not.exist");
  });

  it("should send the request and close dialog and show progress circular when accepting", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/accept",
      delay: 2000,
      response: {}
    }).as("postCaller");
    cy.route("http://localhost:8000/swaps", "fixture:swapWithNoActions.json");

    cy.get("[data-cy=accept-button]").click();

    cy.get("[data-cy=dialog]")
      .find("[data-cy=action-text-field]")
      .find("input")
      .type("ethereum_address");

    cy.get("[data-cy=dialog]")
      .find("[data-cy=ok-button]")
      .click();

    cy.get("[data-cy=action-request-circular-progress]").should("exist");

    cy.wait("@postCaller");

    cy.get("[data-cy=dialog]").should("not.exist");
    cy.get("[data-cy=accept-button]").should("not.exist");
  });
});
