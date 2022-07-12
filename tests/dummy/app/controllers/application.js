import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  plugins = ['besluit'];

  @action
  rdfaEditorInit(controller) {
    const presetContent = `<div property="prov:generated" resource="http://data.lblod.info/id/besluiten/ea1d2b7e-cc37-4b1d-b2a7-4ce9f30ee0b4" typeof="besluit:Besluit https://data.vlaanderen.be/id/concept/BesluitType/256bd04a-b74b-4f2a-8f5d-14dda4765af9 ext:BesluitNieuweStijl">
    <p>Openbare titel besluit:</p>
    <h4 class="h4" property="eli:title" datatype="xsd:string"><span class="mark-highlight-manual">Geef titel besluit op</span></h4>
    <span style="display:none;" property="eli:language" resource="http://publications.europa.eu/resource/authority/language/NLD" typeof="skos:Concept">&nbsp;</span>
    <p>Korte openbare beschrijving:</p>
    <p property="eli:description" datatype="xsd:string"><span class="mark-highlight-manual">Geef korte beschrijving op</span></p>
    <br>
   
    <div property="besluit:motivering" lang="nl">
      <p>
        <span class="mark-highlight-manual">geef bestuursorgaan op</span>,
      </p>
      <br>
   
      <h5>Bevoegdheid</h5>
       <ul class="bullet-list"><li><span class="mark-highlight-manual">Rechtsgrond die bepaalt dat dit orgaan bevoegd is.</span></li></ul>
       <br>
   
      <h5>Juridische context</h5>
      <ul class="bullet-list"><li></li></ul>
   
      <h5>Feitelijke context en argumentatie</h5>
      <ul class="bullet-list"><li><span class="mark-highlight-manual">Voeg context en argumentatie in</span></li></ul>
    </div>
    <br>
    <br>
   
    <h5>Beslissing</h5>
   
    <div property="prov:value" datatype="xsd:string">

    </div>
   </div>`;
    controller.setHtmlContent(presetContent);
    const editorDone = new CustomEvent('editor-done');
    window.dispatchEvent(editorDone);
  }
}
