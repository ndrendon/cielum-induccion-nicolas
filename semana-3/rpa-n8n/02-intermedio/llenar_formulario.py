"""Ejercicio intermedio del día 14: bot de Playwright que llena un formulario de práctica.

Entra al formulario de pruebas de Selenium (un sitio público hecho para practicar),
llena los campos, lo envía, revisa que la página confirme el envío y toma capturas.
Si algo falla, toma una captura del error.

Cómo se corre (dentro de esta carpeta, con el entorno virtual activo):
    python llenar_formulario.py         sin mostrar el navegador
    python llenar_formulario.py --ver   muestra el navegador mientras el bot trabaja
"""

import argparse
import logging
from datetime import datetime
from pathlib import Path

from playwright.sync_api import Error as ErrorPlaywright
from playwright.sync_api import expect, sync_playwright

URL_FORMULARIO = 'https://www.selenium.dev/selenium/web/web-form.html'
CAPTURAS = Path(__file__).resolve().parent / 'capturas'

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)-7s %(message)s', datefmt='%H:%M:%S')
log = logging.getLogger('bot-formulario')


def llenar_formulario(pagina, url, marca):
    log.info('Abriendo %s', url)
    pagina.goto(url)
    expect(pagina.get_by_role('heading', name='Web form')).to_be_visible()

    # Cada campo se busca por su etiqueta, que es lo que ve una persona,
    # y no por su posición en el HTML, que puede cambiar
    pagina.get_by_label('Text input').fill('Nicolas Rendón')
    pagina.get_by_label('Password').fill('clave-de-prueba')
    pagina.get_by_label('Textarea').fill('Formulario llenado por un bot de Playwright en el día 14 de la inducción.')
    pagina.get_by_label('Dropdown (select)').select_option(label='Two')
    pagina.get_by_label('Dropdown (datalist)').fill('Seattle')
    pagina.get_by_label('Default checkbox').check()
    pagina.get_by_label('Default radio').check()
    pagina.get_by_label('Date picker').fill('10/21/2026')
    pagina.keyboard.press('Escape')  # cierra el calendario que se abre al escribir la fecha

    captura = CAPTURAS / f'formulario-lleno_{marca}.png'
    pagina.screenshot(path=captura, full_page=True)
    log.info('Formulario lleno. Captura en %s', captura)

    pagina.get_by_role('button', name='Submit').click()

    # No se usa una espera fija: expect reintenta hasta que aparezca la confirmación (máximo 15 s)
    expect(pagina.get_by_role('heading', name='Form submitted')).to_be_visible()
    expect(pagina.get_by_text('Received!')).to_be_visible()

    captura = CAPTURAS / f'formulario-enviado_{marca}.png'
    pagina.screenshot(path=captura, full_page=True)
    log.info('El formulario se envió y la página respondió "Received!". Captura en %s', captura)


def main():
    argumentos = argparse.ArgumentParser(description='Llena el formulario de práctica de Selenium.')
    argumentos.add_argument('--ver', action='store_true', help='muestra el navegador mientras el bot trabaja')
    argumentos.add_argument('--url', default=URL_FORMULARIO, help='dirección del formulario')
    opciones = argumentos.parse_args()

    CAPTURAS.mkdir(exist_ok=True)
    # La fecha y la hora en el nombre hacen que cada corrida guarde capturas nuevas sin borrar las anteriores
    marca = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')

    with sync_playwright() as playwright:
        navegador = playwright.chromium.launch(headless=not opciones.ver, slow_mo=400 if opciones.ver else 0)
        pagina = navegador.new_page(viewport={'width': 1280, 'height': 800})
        pagina.set_default_timeout(15_000)
        expect.set_options(timeout=15_000)
        try:
            llenar_formulario(pagina, opciones.url, marca)
        except (ErrorPlaywright, AssertionError) as error:
            captura = CAPTURAS / f'error_{marca}.png'
            pagina.screenshot(path=captura, full_page=True)
            log.error('El bot falló: %s', str(error).splitlines()[0])
            log.error('Captura del error en %s', captura)
            raise SystemExit(1) from None
        finally:
            navegador.close()


if __name__ == '__main__':
    main()
