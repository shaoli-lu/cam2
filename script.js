const video = document.querySelector("video")
const textElem = document.querySelector("[data-text]")

async function setup() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true })
  video.srcObject = stream

  video.addEventListener("playing", async () => {
    const worker = Tesseract.createWorker()
    await worker.load()
    await worker.loadLanguage("chi_sim")
    await worker.initialize("chi_sim")

    const canvas = document.createElement("canvas")
    canvas.width = video.width
    canvas.height = video.height

    document.addEventListener("keypress", async e => {
      if (e.code !== "Space") return
      canvas.getContext("2d").drawImage(video, 0, 0, video.width, video.height)
      const {
        data: { text },
      } = await worker.recognize(canvas)

      var msg = new SpeechSynthesisUtterance(text.replace(/\s/g, " "));
      msg.lang = 'zh';
      speechSynthesis.speak(
        msg
      )

      textElem.textContent = text
    })
  })
}

setup()
