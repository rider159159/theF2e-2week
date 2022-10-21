// 紀錄請求中 API
export let RequestPending = []

export function removeRequestPending(config) {
  RequestPending.forEach((item, index, arr) => {
    if (item.uuid === `${config.url}&${config.method}`) {
      item.cancel()
      arr.splice(index, 1)
    }
  })
}

export function cancelAllPending() {
  RequestPending.forEach((item) => {
    item.cancel()
  })
  RequestPending = []
}

export function clearRequestPending(config) {
  RequestPending = RequestPending.filter((item) => item.uuid !== `${config.url}&${config.method}`)
}

export function addRequestPending(item) {
  RequestPending.push(item)
}