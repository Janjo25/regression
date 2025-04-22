(async function runDecisionTreeAnalysis() {
    const {
        DecisionTreeClassifier,
        LabelEncoder,
        accuracyScore
    } = await import('https://luisespino.github.io/mlearnjs/mlearn.mjs');

    const fullnessArr = ['Some','Full','Some','Full','Full','Some','None','Some','Full','Full','None','Full'];
    const hungryArr   = ['Yes','Yes','No','Yes','Yes','No','No','No','Yes','Yes','No','Yes'];
    const cuisineArr  = ['French','Thai','Burger','Thai','French','Italian','Burger','Thai','Burger','Italian','Thai','Burger'];
    const targetArr   = ['Yes','No','Yes','Yes','No','Yes','No','Yes','Yes','No','No','Yes'];

    const rows = fullnessArr.map((_, i) => `
    <tr>
      <td>${fullnessArr[i]}</td>
      <td>${hungryArr[i]}</td>
      <td>${cuisineArr[i]}</td>
      <td>${targetArr[i]}</td>
    </tr>
  `).join('');
    document.getElementById('table-container').innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Pat</th><th>Hun</th><th>Type</th><th>WillWait</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

    const encoder     = new (await LabelEncoder())();
    const encPat      = encoder.fitTransform(fullnessArr);
    const encHun      = encoder.fitTransform(hungryArr);
    const encType     = encoder.fitTransform(cuisineArr);
    const encLabel    = encoder.fitTransform(targetArr);

    const featureMatrix = encPat.map((v,i) => [ v, encHun[i], encType[i] ]);

    const DTFactory = await DecisionTreeClassifier();
    const treeModel = new DTFactory();
    treeModel.fit(featureMatrix, encLabel);

    const predEnc   = treeModel.predict(featureMatrix);
    const predictions = encoder.inverseTransform(predEnc);
    const scoreFn   = await accuracyScore();
    const accuracy  = (scoreFn(encLabel, predEnc) * 100).toFixed(2);

    document.getElementById('log-tree').innerHTML = `
    <h3>Predicciones:</h3>
    <pre>${JSON.stringify(predictions)}</pre>
    <h3>Precisión:</h3>
    <p>${accuracy}%</p>
    <h3>Árbol descriptivo:</h3>
    <pre>${treeModel.printTree(treeModel.tree)}</pre>
    <h3>Gain track:</h3>
    <pre>${JSON.stringify(treeModel.gain, null, 2)}</pre>
  `;
})();
