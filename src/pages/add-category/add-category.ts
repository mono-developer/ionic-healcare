import { Component } from '@angular/core';
import { NavController , ViewController, NavParams, AlertController, IonicPage} from 'ionic-angular';
@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-add-category',
  templateUrl: 'add-category.html'
})
export class AddCategoryPage {

categories: Array<{id:number, name:string, page:any, icon:string, show:boolean}>;

pagesList:any={};

public addedCategories: Array<any>;
constructor(
  public navCtrl: NavController,
  public viewCtrl: ViewController,
  private navParams: NavParams,
  public alertCtrl: AlertController

) {


  this.addedCategories = this.navParams.get("ids");

  this.pagesList = {'OtherInfoPage':'OtherInfoPage', 'SurgeriesPage':'SurgeriesPage',
                          'LabsPage':'LabsPage', 'LivingWillPage': 'LivingWillPage', 'DNRPage': 'DNRPage', 'FamilyHistoryPage': 'FamilyHistoryPage',
                          'ImmunizationsPage': 'ImmunizationsPage', 'PharmaciesPage': 'PharmaciesPage', 'PregnancyPage': 'PregnancyPage',
                          'MedicalImagingPage': 'MedicalImagingPage'
           };

  this.categories = [
    { id: 8, name: 'Surgeries', page: 'SurgeriesPage',icon:'surgeon', show: true},
    { id: 9, name: 'Labs', page: 'LabsPage', icon:'test-tube', show: true},
    { id: 12, name: 'Family History', page: 'FamilyHistoryPage', icon:'family', show: true},
    { id: 13, name: 'Immunizations', page: 'ImmunizationsPage', icon:'syringe', show: true},
    { id: 14, name: 'Pharmacies', page: 'PharmaciesPage', icon:'medical-kit', show: true},
    { id: 15, name: 'Medical Imaging', page: 'MedicalImagingPage', icon:'x-ray', show: true},
    { id: 17, name: 'Other Info', page: 'OtherInfoPage', icon:'info', show: false},
    { id: 16, name: 'Pregnancy', page: 'PregnancyPage', icon:'baby-stroller', show: true}
  ];

  let that = this;

  this.categories.map((category)=>{
    if(that.addedCategories.indexOf(category.id)>-1 || category.id == 17) {
      category.show = false;
    } else {
      category.show = true;
    }
  })
}

  onClickCategory(category) {
    if(category.show) {
      let confirm = this.alertCtrl.create({
        title: 'Add '+ category.name +' Category?',
        message: 'Do you want to record ' + category.name + ' now?',
        buttons: [
          {
            text: 'No, Later',
            handler: () => {
              this.addCategory(category, 'hide');
            }
          },
          {
            text: 'Agree',
            handler: () => {
              this.addCategory(category, 'show');
            }
          }
        ]
      });
      confirm.present();
    }
  }

  addCategory(category, value) {
    if(category.show) {
      category.show = false;
      this.viewCtrl.dismiss({category: category, value: value});
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
