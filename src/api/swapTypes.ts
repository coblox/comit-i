import { toBitcoin } from "satoshi-bitcoin-ts";
import { fromWei } from "web3-utils";

export interface Asset {
  name: string;
  quantity: string;
  token_contract?: string;
}

export function toMainUnit(asset: Asset) {
  switch (asset.name) {
    case "ether":
      return fromWei(asset.quantity, "ether") + " ETH";
    case "bitcoin":
      return toBitcoin(asset.quantity, true) + " BTC";
    case "erc20":
      return asset.quantity + " ERC20";
    default:
      return asset.quantity + " " + asset.name;
  }
}

export interface Ledger {
  name: string;
  network: string;
}

export interface Parameters {
  alpha_asset: Asset;
  alpha_ledger: Ledger;
  beta_asset: Asset;
  beta_ledger: Ledger;
}

export enum Protocol {
  Rfc003 = "rfc003"
}

export enum Status {
  InProgress = "IN_PROGRESS",
  Swapped = "SWAPPED",
  NotSwapped = "NOT_SWAPPED",
  InternalFailure = "INTERNAL_FAILURE"
}

export enum Role {
  Alice = "Alice",
  Bob = "Bob"
}

export enum LedgerKind {
  Alpha = "Alpha",
  Beta = "Beta"
}

export enum HtlcState {
  NotDeployed = "NotDeployed",
  Deployed = "Deployed",
  Funded = "Funded",
  Redeemed = "Redeemed",
  Refunded = "Refunded"
}

export interface LedgerState {
  status: HtlcState;
  htlc_location?: any;
  deploy_tx?: string;
  fund_tx?: string;
  redeem_tx?: string;
  refund_tx?: string;
}

export enum CommunicationStatus {
  Sent = "SENT",
  Accepted = "ACCEPTED",
  Rejected = "REJECTED"
}

export interface CommunicationState {
  alpha_expiry: number;
  alpha_redeem_identity: string | null;
  alpha_refund_identity: string;
  beta_expiry: number;
  beta_redeem_identity: string;
  beta_refund_identity: string | null;
  secret_hash: string;
  status: CommunicationStatus;
}

export interface State {
  alpha_ledger: LedgerState;
  beta_ledger: LedgerState;
  communication: CommunicationState;
}

export interface Properties {
  parameters: Parameters;
  protocol: Protocol;
  status: Status;
  role: Role;
}

export interface AdditionalProperties {
  state: State;
}
