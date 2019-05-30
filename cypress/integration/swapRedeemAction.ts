/// <reference types="Cypress" />

describe("The Redeem action", () => {
  describe("Ethereum redeem action", () => {
    it("should show a ledger action to the user in a dialog", () => {
      cy.server();
      cy.route(
        "http://localhost:8000/swaps",
        "fixture:swapWithRedeemEthereum.json"
      );
      cy.route({
        method: "GET",
        url: "**/redeem",
        response: "fixture:ledgerActions/ethereum-call-contract.json",
        headers: {
          "content-type": "application/json"
        },
        delay: 2000
      }).as("getLedgerAction");

      cy.visit("/show_resource/swaps");
      cy.get("[data-cy=redeem-button]").click();

      cy.get("[data-cy=dialog]").should("not.exist");
      cy.get("[data-cy=action-request-circular-progress]").should("exist");

      cy.wait("@getLedgerAction");

      cy.get("[data-cy=dialog]").should("exist");
    });
  });

  describe("Bitcoin redeem action", () => {
    it("should show a ledger action to the user in a dialog", () => {
      cy.server();
      cy.route(
        "http://localhost:8000/swaps",
        "fixture:swapWithRedeemBitcoin.json"
      );
      cy.route({
        method: "GET",
        url: "**/redeem?**",
        response:
          "fixture:ledgerActions/bitcoin-broadcast-signed-transaction.json",
        headers: {
          "content-type": "application/json"
        },
        delay: 2000
      }).as("getLedgerAction");

      cy.visit("/show_resource/swaps");
      cy.get("[data-cy=redeem-button]").click();

      cy.get("[data-cy=dialog]").should("exist");
      cy.get("[data-cy=dialog]")
        .find("[data-cy=action-text-field]:nth(0)")
        .find("input")
        .type("bitcoin_address");

      cy.get("[data-cy=dialog]")
        .find("[data-cy=action-text-field]:nth(1)")
        .find("input")
        .type(20);

      cy.get("[data-cy=dialog]")
        .find("[data-cy=redeem-button]")
        .click();
      cy.get("[data-cy=dialog]").should("not.exist");

      cy.get("[data-cy=action-request-circular-progress]").should("exist");
      cy.wait("@getLedgerAction");

      cy.get("[data-cy=dialog]").should("exist");
    });
  });
});
