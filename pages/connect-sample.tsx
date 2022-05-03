import {
  ConnectType,
  useWallet,
  WalletStatus,
} from "@terra-money/wallet-provider";
import React, { useCallback, useEffect } from "react";
import eventEmitter from "utils/eventEmitter";

export default function ConnectSample() {
  const {
    status,
    network,
    wallets,
    availableConnectTypes,
    availableInstallTypes,
    availableConnections,
    supportFeatures,
    connect,
    install,
    disconnect,
  } = useWallet();
  const onWalletConnectDetected = useCallback((node) => {
    if (node !== null && typeof window.ReactNativeWebView !== "undefined") {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "found",
        })
      );
    }
    eventEmitter.on("connect", () => node.click());
  }, []);

  useEffect(() => {
    eventEmitter.on("disconnect", disconnect);
    return () => {
      eventEmitter.off("disconnect", disconnect);
    };
  }, [disconnect]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.ReactNativeWebView !== "undefined"
    ) {
      if (status === WalletStatus.INITIALIZING) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "changeStatus",
            data: "initializing",
          })
        );
      }
      if (status === WalletStatus.WALLET_CONNECTED) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "changeStatus",
            data: "connected",
          })
        );
      }
      if (status === WalletStatus.WALLET_NOT_CONNECTED) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "changeStatus",
            data: "not_connected",
          })
        );
      }
    }
  }, [status]);

  return (
    <div>
      <h1>Connect Sample</h1>
      <section>
        <pre>
          {JSON.stringify(
            {
              status,
              network,
              wallets,
              supportFeatures: Array.from(supportFeatures),
              availableConnectTypes,
              availableInstallTypes,
            },
            null,
            2
          )}
        </pre>
      </section>

      {status !== WalletStatus.WALLET_CONNECTED && (
        <footer>
          {status === WalletStatus.WALLET_NOT_CONNECTED && (
            <>
              {availableInstallTypes.map((connectType) => (
                <button
                  key={"install-" + connectType}
                  onClick={() => install(connectType)}
                >
                  Install {connectType}
                </button>
              ))}
              {availableConnectTypes.map((connectType) => (
                <button
                  key={"connect-" + connectType}
                  onClick={() => connect(connectType)}
                >
                  Connect {connectType}
                </button>
              ))}
              <br />
              {availableConnections.map(
                ({ type, name, icon, identifier = "" }) => (
                  <button
                    key={"connection-" + type + identifier}
                    onClick={() => connect(type, identifier)}
                    ref={
                      type === "WALLETCONNECT" ? onWalletConnectDetected : null
                    }
                  >
                    <img
                      src={icon}
                      alt={name}
                      style={{ width: "1em", height: "1em" }}
                    />
                    {name} [{identifier}] {type}
                  </button>
                )
              )}
            </>
          )}
        </footer>
      )}
      <button onClick={() => eventEmitter.emit("connect")}>mock</button>
    </div>
  );
}
