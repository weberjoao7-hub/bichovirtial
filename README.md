# Bicho Virtual

Jogo mobile-first de bichinho virtual, publicado como site estático, sem servidor nem dependências de execução.

**Jogar:** https://weberjoao7-hub.github.io/bichovirtial/jogar-v2.html

## Estado atual — V3.2 (31/10/2026)

- Gato, coelho e urso agora usam sprites originais em pixel art vetorial de 128×128, com silhuetas completas, orelhas inteiras e transparência. O renderizador `assets/pet-art.js` cria cada sprite uma única vez e reutiliza URLs Blob, sem depender dos WebPs recortados.
- Cada espécie possui 11 poses com dois quadros de desenho diferentes por pose (22 quadros por personagem): parado, feliz, fome, doente, dormir, comer, brincar, banho, cuidados, pular e alongar. As poses são selecionadas por fragmento SVG e respeitam a preferência por movimento reduzido.
- Ovo pixel art específico para cada espécie, com versão rachada antes do nascimento.
- Ações, crescimento, moedas, minijogo com intervalo de 60 segundos e conquistas; progresso salvo no localStorage do navegador.
- Interface principal em uma única tela móvel, com modais para adoção, alimentação, minijogo e ajuda.
- Backup JSON portátil em **Como jogar → Baixar backup** e restauração validada em **Como jogar → Restaurar backup**. O arquivo contém dados do bichinho e deve ser guardado em local privado.
- Tratamento de navegadores que bloqueiam o armazenamento local: o jogo continua funcionando, com aviso ⚠ na versão, mas não consegue preservar progresso nesse caso.

## Desenvolvimento e verificação

Abra index.html ou jogar-v2.html em um servidor estático. Ambos devem permanecer idênticos. Execute `node tests/smoke.cjs` para validar os três animais, estados do ovo, sintaxe, animações e integridade dos arquivos de arte. O workflow de qualidade também executa `node tests/browser.cjs` com Playwright e Chromium, simulando ações, backup/restauração e quatro tamanhos de tela. São geradas 12 capturas de tela dos personagens (3 espécies × 4 resoluções) e uma da adoção, anexadas como artefatos do workflow para revisão visual. Para rodar os testes de navegador localmente, instale Playwright e Chromium.

**Limitações conhecidas:** a nova arte de 128×128 precisa de revisão visual em aparelhos reais; as animações possuem dois quadros próprios por ação, mas movimentos mais fluidos e maior variedade de quadros ainda são desejáveis. Testes manuais em diferentes aparelhos reais são necessários. O progresso fica no navegador/dispositivo e não é sincronizado entre aparelhos.

## Histórico recente

- **V3.2 (31/10/2026):** substituição integral dos sprites recortados por três personagens completos e autorais em pixel art 128×128; 22 quadros por espécie, dois por pose, sem reutilizar o WebP cortado. Adoção e jogo usam a mesma arte. Testes ampliados para verificar as bordas transparentes, poses visualmente distintas e as quatro resoluções móveis.

- **V3.1:** reconstrução pixel art dos topos ausentes de gato, coelho e urso nos SVGs animados; adoção agora mostra os mesmos personagens do jogo, com visual unificado. SVGs respeitam preferência por movimento reduzido. Testes passaram a exigir arte reconstruída e carregamento dos três personagens na adoção.

- **V3.0:** o minijogo de presentes passou a ter uma rodada por minuto, com proteção contra cliques duplicados e intervalo persistido no salvamento e no backup. Isso impede moedas ilimitadas por repetição instantânea.

- **V2.9:** backup e restauração de progresso com validação, recuperação segura quando o navegador bloqueia localStorage e suíte de testes reais de navegador em resoluções móveis.

- **V2.8:** ovos pixel art originais, movimento animado por estado para três espécies, ação de acordar, bloqueio de brincadeira/alimentação durante o sono e verificação automatizada.
- **V2.7:** arte pixel HD na adoção e no jogo, melhorias na posição dos animais e equilíbrio do desgaste.
