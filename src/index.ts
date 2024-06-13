import {generateMnemonic, mnemonicToKeyPair} from "tonweb-mnemonic";

if (document.readyState === "complete") {
  main();
} else {
  window.addEventListener("load", main);
}

function main() {
  const TonWeb = (window as any).TonWeb;
  const provider = new TonWeb.HttpProvider(
    "https://toncenter.com/api/v2/jsonRPC",
    {
      apiKey: undefined
    }
  );
  const $wordsInput = document.getElementById("words-input");
  const $startButton = document.getElementById("start-button");
  const $output = document.getElementById("output");
  $startButton?.addEventListener("click", start);

  async function start() {
    const suff = document.getElementById("desired-suffix")?.value.toLowerCase()
    console.log(suff)
    while (true) {
      const words = await generateMnemonic()
      const keyPair = await mnemonicToKeyPair(words);
      const wallet = new TonWeb.Wallets.all.v4R2(provider, {
        publicKey: keyPair.publicKey
      });
      const address = await wallet.getAddress();
      const EQ=address.toString(true, true, true);
      const UQ=address.toString(true, true, false);
      console.log(EQ)
      console.log(UQ)
      if (EQ.toLowerCase().endsWith(suff) || UQ.toLowerCase().endsWith(suff)) {
        renderHr();
        renderOutput({
        label: `Wallet: ${wallet.getName()}`,
        values: [
          "Type1 (EQ): "+EQ,
          "Type2 (UQ): "+UQ
        ]
        });
      }
      }
  }

  function renderOutput(params: { label: string; values: string[] }) {
    if (params.label) {
      const $label = document.createElement("p");
      $label.innerHTML = `<strong>${params.label}</strong>`;
      $output?.appendChild($label);
    }
    for (const value of params.values) {
      const $value = document.createElement("p");
      $value.setAttribute("class", "value");
      $value.innerHTML = value;
      $output?.appendChild($value);
    }
  }

  function renderHr() {
    $output?.appendChild(document.createElement("hr"));
  }
}
