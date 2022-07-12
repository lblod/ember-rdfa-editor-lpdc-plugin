import uuid from 'ember-rdfa-editor-lpdc-plugin/utils/uuid';

export default class InsertArticleCommand {
  name = 'insert-article';

  canExecute() {
    return true;
  }

  execute(controller, articleNumber, content) {
    const limitedDatastore = controller.datastore.limitToRange(
      controller.selection.lastRange,
      'rangeIsInside'
    );
    const besluit = limitedDatastore
      .match(null, 'a', '>http://data.vlaanderen.be/ns/besluit#Besluit')
      .asSubjectNodes()
      .next().value;
    const besluitNode = [...besluit.nodes][0];
    let articleContainerNode;
    for (let child of besluitNode.children) {
      if (child.attributeMap.get('property') === 'prov:value') {
        articleContainerNode = child;
        break;
      }
    }
    const range = controller.rangeFactory.fromInNode(
      articleContainerNode,
      articleContainerNode.getMaxOffset(),
      articleContainerNode.getMaxOffset()
    );

    const articleHtml = `
      <div property="eli:has_part" prefix="mobiliteit: https://data.vlaanderen.be/ns/mobiliteit#" typeof="besluit:Artikel" resource="http://data.lblod.info/artikels/${uuid()}">
        <div property="eli:number" datatype="xsd:string">Artikel ${articleNumber}</div>
        <span style="display:none;" property="eli:language" resource="http://publications.europa.eu/resource/authority/language/NLD" typeof="skos:Concept">&nbsp;</span>
        <div propert="prov:value" datatype="xsd:string">
        ${content}
        </div>
      </div>
    `;
    controller.executeCommand('insert-html', articleHtml, range);
  }
}
