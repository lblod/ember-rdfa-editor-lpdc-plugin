import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { getOwner } from '@ember/application';
import uuid from 'ember-rdfa-editor-lpdc-plugin/utils/uuid';

const AUDIENCE_TO_URI_MAP = {
  'Burger': {
    uri: 'http://data.lblod.info/public-services/13643e20-631a-11ec-90d6-0242ac120003',
    name: 'burgers'
  },
  'Onderneming': {
    uri: 'http://data.lblod.info/public-services/136440dc-631a-11ec-90d6-0242ac120003' ,
    name: 'ondernemingen'
  },
  'Organisatie': {
    uri: 'http://data.lblod.info/public-services/13644212-631a-11ec-90d6-0242ac120003',
    name: 'organisaties'
  }
};

export default class LpdcPublicServiceModalComponent extends Component {
  @tracked serviceFilter;
  @tracked showTable = true;
  @tracked selectedService;
  @tracked cost;
  @tracked from;
  @tracked to;

  services;
  constructor() {
    super(...arguments);
    const config = getOwner(this).resolveRegistration('config:environment');
    this.services = config.publicServices;
  }

  setFilter(filter) {
    this.serviceFilter = filter;
  }

  get filteredServices() {
    // TODO use filter
    return this.services;
  }

  @action
  closeModal() {
    this.selectedService = null;
    this.showTable = true;
    this.args.closeModal();
  }

  @action
  extend(service) {
    this.selectedService = service;
    this.showTable = false;
  }

  @action
  changeFromDate(isoDate, date) {
    this.from = date;
  }

  @action
  changeToDate(isoDate, date) {
    this.to = date;
  }

  @action
  insert() {
    this.insertLPDCRules(this.selectedService, {
      cost: this.cost,
      availability: { from: this.from, to: this.to },
    });
    this.backToTableView();
    this.closeModal();
  }

  @action
  backToTableView() {
    this.showTable = true;
    this.selectedService = null;
    this.cost = null;
    this.from = null;
    this.to = null;
  }

  insertLPDCRules(service, params = {}) {
    const publicServiceURI = 'http://data.lblod.info/public-services/' + uuid();
    const goal = `<strong>Doel</strong>
           <div resource="${publicServiceURI}" typeof="http://purl.org/vocab/cpsv#PublicService">
             <p property="dct:description">${service["Inhoud"]}</p>
            </div>
`;
    const audiences = service["Doelgroep"].split(", ").map((s) => {
      return {
        title: AUDIENCE_TO_URI_MAP[s]["name"],
        uri: AUDIENCE_TO_URI_MAP[s]["uri"]
      };
    });
    const targetAudience = `
           <strong>Doelgroep</strong>
           <div resource="${publicServiceURI}" typeof="http://purl.org/vocab/cpsv#PublicService">
<p>De doelgroepen van <span class="mark-highlight-manual">de/het</span> ${service["Titel"]} zijn ${audiences.map((x) => `<a property="http://data.europa.eu/m8g/http://data.europa.eu/m8g/isClassifiedBy" href="${x.uri}">${x.title}</a>`).join(', ')}
            </div>
`;
    const ruleURI = 'http://data.lblod.info/rules/' + uuid();
    const rules = `
           <strong>Regels</strong>
           <div resource="${publicServiceURI}" typeof="http://purl.org/vocab/cpsv#PublicService">
<div property="http://purl.org/vocab/cpsv#follows" resource="${ruleURI}" typeof="http://purl.org/vocab/cpsv#Rule"><p property="http://purl.org/dc/terms/description">${service['Voorwaarden'] ? service['Voorwaarden'] : `<span class="mark-highlight-manual">beschrijf de procedure die gevolgt dient te worden</span>`}</p></div>
</div>
`;
    const controller = this.args.controller;
    controller.executeCommand('insert-article', controller, 1, goal);
    controller.executeCommand('insert-article', controller, 2, targetAudience);
    controller.executeCommand('insert-article', controller, 3, rules);
    let articleNumber= 4;
    if (params.cost) {
      const cost = `
           <strong>Kosten</strong>
           <div resource="${publicServiceURI}" typeof="http://purl.org/vocab/cpsv#PublicService">
<div property="http://data.europa.eu/m8g/hasCost" resource="${ruleURI}" typeof="https://data.europa.eu/m8g/Cost">Voor ${service.Titel} wordt een kost van <span property="https://data.europa.eu/m8g/value">${params.cost}</span> <span property="https://data.europa.eu/m8g/currency" resource="http://publications.europa.eu/resource/authority/currency/EUR">EUR</span> voorzien.</div>
</div>
`;
      controller.executeCommand('insert-article', controller, articleNumber, cost);
      articleNumber++;
    }
    if (params.availability?.from) {
      const availability = `Dit reglement treedt in werking op ${params.availability.from.toLocaleString('nl-BE')}, en is geldig ${params.availability.to ? `tot ${params.availability.to.toLocaleString('nl-BE')}` : "voor onbepaalde duur"}.`;
      controller.executeCommand('insert-article', controller, articleNumber, availability);
    }
  }
}
