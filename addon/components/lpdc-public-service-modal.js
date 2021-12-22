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
    console.log(this.selectedService);
    console.log(this.cost);
    console.log(this.from);
    console.log(this.to);
  }

  insertLPDCRules(service, params) {
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
<p>De doelgroepen van <span class="mark-highlight-manual">de/het</span> ${service["Titel"]} zijn ${audiences.map((x) => `<a property="http://data.europa.eu/m8g/http://data.europa.eu/m8g/isClassifiedBy" href="${x.uri}">${x.title}</a>`).join(',')}
            </div>
`;
    const controller = this.args.controller;
    controller.executeCommand('insert-article', controller, 1, goal);
    controller.executeCommand('insert-article', controller, 2, targetAudience);
  }
}
