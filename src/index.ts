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
        ],
        words: words
        });
      }
      }
  }

  function renderOutput(params: { label: string; values: string[]; words: string[] }) {
    const $output = document.getElementById('output'); // Assuming there's an element with the ID 'output'

    // Create and style the popup notification element
    const $popup = document.createElement("div");
    $popup.setAttribute("id", "popup");
    $popup.style.position = "fixed";
    $popup.style.bottom = "20px";
    $popup.style.right = "20px";
    $popup.style.padding = "10px 20px";
    $popup.style.backgroundColor = "rgba(0,0,0,0.7)";
    $popup.style.color = "white";
    $popup.style.borderRadius = "5px";
    $popup.style.opacity = "0";
    $popup.style.transition = "opacity 0.3s";
    document.body.appendChild($popup);

    function showPopup(message: string) {
      $popup.innerHTML = message;
      $popup.style.opacity = "1";
      setTimeout(() => {
        $popup.style.opacity = "0";
      }, 2000); // Hide after 2 seconds
    }

    if (params.label) {
      const $label = document.createElement("p");
      $label.innerHTML = `<strong>${params.label}</strong>`;
      $output?.appendChild($label);
    }

    for (const value of params.values) {
      const $value = document.createElement("p");
      $value.setAttribute("class", "value");
      $value.innerHTML = value;
      $value.addEventListener('click', () => {
        const wordsString = params.words.join(' ');
        navigator.clipboard.writeText(wordsString).then(() => {
          console.log('Copied to clipboard:', wordsString);
          showPopup('Copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy:', err);
        });
      });
      $output?.appendChild($value);
    }
  }

  function renderHr() {
    $output?.appendChild(document.createElement("hr"));
  }
}
