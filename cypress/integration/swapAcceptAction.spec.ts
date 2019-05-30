/// <reference types="Cypress" />

describe("The Accept action", () => {
  // TODO: Move to snapshot tests
  // it("should have the correct field name", () => {
  //     cy.get("[data-cy=dialog]").find("[data-cy=action-text-field]").contains("Refund address on Ethereum").should("exist");
  // });
  // it("should show the correct text in the action button", () => {
  //     cy.get("[data-cy=dialog]").within(() => {
  //         cy.get("[data-cy=accept-button]").should("have.text", "Execute Accept");
  //     })
  // });
  // it("should have the correct text in close button", () => {
  //     cy.get("[data-cy=dialog]").find("[data-cy=close-button]").should("have.text", "Close");
  // });

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

  it("should contain the correct amount of action fields", () => {
    cy.get("[data-cy=dialog]")
      .find("[data-cy=action-text-field]")
      .should("have.length", 1);
  });

  it("should have an action button", () => {
    cy.get("[data-cy=dialog]").within(() => {
      cy.get("[data-cy=accept-button]").should("exist");
    });
  });

  it("should have a close button", () => {
    cy.get("[data-cy=dialog]")
      .find("[data-cy=close-button]")
      .should("exist");
  });

  it("should close the dialog when clicking close", () => {
    cy.get("[data-cy=dialog]")
      .find("[data-cy=close-button]")
      .click();
    cy.get("[data-cy=dialog]").should("not.exist");
  });

  it("should close the dialog when accepting", () => {
    cy.get("[data-cy=accept-button]").click();

    cy.get("[data-cy=dialog]")
      .find("[data-cy=action-text-field]")
      .find("input")
      .type("ethereum_address");

    cy.server();
    cy.route("POST", "**/accept", {}).as("postCaller");
    cy.get("[data-cy=dialog]")
      .find("[data-cy=accept-button]")
      .click();
    cy.wait("@postCaller");

    cy.get("[data-cy=dialog]").should("not.exist");
  });
});
