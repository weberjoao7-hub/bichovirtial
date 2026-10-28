# Bicho Virtual

Jogo mobile-first de bichinho virtual, publicado como site estático, sem servidor nem dependências de execução.

**Jogar:** https://weberjoao7-hub.github.io/bichovirtial/jogar-v2.html

## Estado atual — V2.9 (28/10/2026)

- Gato, coelho e urso usam arte pixel HD original com transparência.
- Animações por espécie e estado: respirar, felicidade, fome, doença, sono, comer, brincar, banho, cuidados e alongamento. A arte é incorporada em SVGs independentes com estados controlados por fragmento da URL.
- Ovo pixel art específico para cada espécie, com versão rachada antes do nascimento.
- Ações, crescimento, moedas, minijogo e conquistas; progresso salvo no localStorage do navegador.
- Interface principal em uma única tela móvel, com modais para adoção, alimentação, minijogo e ajuda.
- Backup JSON portátil em **Como jogar → Baixar backup** e restauração validada em **Como jogar → Restaurar backup**. O arquivo contém dados do bichinho e deve ser guardado em local privado.
- Tratamento de navegadores que bloqueiam o armazenamento local: o jogo continua funcionando, com aviso ⚠ na versão, mas não consegue preservar progresso nesse caso.

## Desenvolvimento e verificação

Abra index.html ou jogar-v2.html em um servidor estático. Ambos devem permanecer idênticos. Execute `node tests/smoke.cjs` para validar os três animais, estados do ovo, sintaxe, animações e integridade dos arquivos de arte. O workflow de qualidade também executa `node tests/browser.cjs` com Playwright e Chromium, simulando ações, backup/restauração e quatro tamanhos de tela. Capturas de tela são anexadas como artefatos do workflow. Para rodar os testes de navegador localmente, instale Playwright e Chromium.

**Limitações conhecidas:** as animações usam transformações em etapas sobre o desenho original, e não um conjunto de quadros redesenhados à mão; testes manuais em diferentes aparelhos reais ainda são necessários. O progresso fica no navegador/dispositivo e não é sincronizado entre aparelhos.

## Histórico recente

- **V2.9:** backup e restauração de progresso com validação, recuperação segura quando o navegador bloqueia localStorage e suíte de testes reais de navegador em resoluções móveis.

- **V2.8:** ovos pixel art originais, movimento animado por estado para três espécies, ação de acordar, bloqueio de brincadeira/alimentação durante o sono e verificação automatizada.
- **V2.7:** arte pixel HD na adoção e no jogo, melhorias na posição dos animais e equilíbrio do desgaste.
