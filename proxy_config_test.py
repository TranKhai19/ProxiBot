import requests
import random
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs import play
import os

PROXY_LIST = [
    "38.154.227.167:5868:fheilixw:affxwfk8a0j1",
    "198.23.239.134:6540:fheilixw:affxwfk8a0j1",
    "207.244.217.165:6712:fheilixw:affxwfk8a0j1",
    "107.172.163.27:6543:fheilixw:affxwfk8a0j1",
    "216.10.27.159:6837:fheilixw:affxwfk8a0j1",
    "136.0.207.84:6661:fheilixw:affxwfk8a0j1",
    "64.64.118.149:6732:fheilixw:affxwfk8a0j1",
    "142.147.128.93:6593:fheilixw:affxwfk8a0j1",
    "104.239.105.125:6655:fheilixw:affxwfk8a0j1",
    "206.41.172.74:6634:fheilixw:affxwfk8a0j1"
]

def parse_proxy(proxy_string):
    try:
        ip, port, username, password = proxy_string.split(':')
        return {
            "ip": ip,
            "port": port,
            "username": username,
            "password": password
        }
    except ValueError:
        print(f"Invalid proxy format: {proxy_string}")
        return None
    
def get_random_proxy():
    proxy_random = random.choice(PROXY_LIST)
    proxy_info = parse_proxy(proxy_random)
    if proxy_info:
        return {
            "http": f"http://{proxy_info['username']}:{proxy_info['password']}@{proxy_info['ip']}:{proxy_info['port']}",
            "https": f"http://{proxy_info['username']}:{proxy_info['password']}@{proxy_info['ip']}:{proxy_info['port']}"
        }
    else:
        return None
    
def test_proxy(proxy):
    test_url = "https://api.ipify.org?format=json"
    try:
        response = requests.get(test_url, proxies=proxy, timeout=10)
        if response.status_code == 200:
            print(f"Proxy working: {response.json()['ip']}")
            return True
        else:
            print(f"Proxy failed with status code: {response.status_code}")
            return False
    except requests.RequestException as e:
        print(f"Proxy error: {e}")
        return False
    
def call_elevenlabs_api(text, voice_id, api_key):
    """Gọi API ElevenLabs với proxy ngẫu nhiên."""
    proxy = get_random_proxy()
    if not proxy:
        print("No valid proxy found.")
        return None
    
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {"xi-api-key": api_key}
    data = {"text": text}
    
    try:
        response = requests.post(url, headers=headers, json=data, proxies=proxy, timeout=10)
        if response.status_code == 200:
            print("API call successful!")
            return response.content
        else:
            print(f"API call failed with status code: {response.status_code}")
            return None
    except requests.RequestException as e:
        print(f"API call error: {e}")
        return None

if __name__ == "__main__":
    # Kiểm tra tất cả proxy
    for proxy_string in PROXY_LIST:
        proxy_info = parse_proxy(proxy_string)
        if proxy_info:
            proxy = {
                "http": f"http://{proxy_info['username']}:{proxy_info['password']}@{proxy_info['ip']}:{proxy_info['port']}",
                "https": f"http://{proxy_info['username']}:{proxy_info['password']}@{proxy_info['ip']}:{proxy_info['port']}"
            }
            test_proxy(proxy)
    
    # Ví dụ gọi ElevenLabs API
    load_dotenv()

    elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
    )

    audio = elevenlabs.text_to_speech.convert(
        text="""
        Gặp em trong những người bạn thân quen một ngày mùa đông
        Nhiều năm xa cách kể từ lúc ấy chẳng còn chờ mong
        Và thời gian đã nhuộm màu chính ta nên giờ mình khác xưa
        Đôi nếp nhăn đầu mùa

        Giờ thôi xao xuyến nhưng còn bâng khuâng như chuyện vừa qua
        Chuyện thời thương mến chỉ bằng đan tay hôn vội vài giây
        Và dù ta cũng có niềm chưa vui mất ngàn ngày để vơi
        Nhưng đã qua cả rồi khi vui hãy nhớ
    """,
        voice_id="JBFqnCBsd6RMkjVDRZzb",
        model_id="eleven_flash_v2_5",
        output_format="mp3_44100_128",
    )

    play(audio)