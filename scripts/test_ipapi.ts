async function testIpApi() {
  try {
    const response = await fetch('https://ipapi.co/json/')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log('ipapi.co response:', data)
  } catch (error) {
    console.error('Error testing ipapi.co:', error)
  }
}

testIpApi()