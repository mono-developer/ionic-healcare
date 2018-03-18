import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, AlertController, LoadingController, ActionSheetController, PopoverController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonAlphaScrollModule } from '../../components/ionic2-alpha-scroll';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import { UserService } from "../../providers/user-service";
import { convertDataToISO } from 'ionic-angular/util/datetime-util';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  public profiles: any;
  public profile_id: number;
  public personData: any;
  public subscription_type: any;
  public email: string;
  public auth_token: string;
  public relationship: string;
  public config: Object;
  public isLoading: boolean = false;

  public share: any = {};
  public parent_id: any;
  public parents: Array<any>;
  public documents: any;
  groupedContacts = [];
  searchItem: string = '';

  public lists: any;

  public folder_name: any;
  public checkbox_flag: any;
  public select_flag: any;
  public selected_ids: any = [];

  public pages: Array<{ id: number, name: string, page: any, icon: string, show: boolean, sup: string }>;

  searchQuery: string = '';
  items: string[];
  public addedCategories: Array<any> = [];

  public slug: Array<string> = [];
  public slugValue: any;
  public itemName: any;

  pagesList: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public popOverCtrl: PopoverController,
    private inAppBrowser: InAppBrowser,
    public storage: Storage,
    public userService: UserService,
  ) {

    let that = this;
    this.config = {
      scrollbar: '.swiper-scrollbar',
      scrollbarHide: true,
      slidesPerView: 'auto',
      centeredSlides: true,
      observer: true,
      spaceBetween: 40,
      grabCursor: true,
      onSlideChangeEnd: function (swiper) {
        that.swipe(swiper);
      }
    };

    this.email = "";
    this.auth_token = "";
    // this.pages = [{ id: 0, name: 'Personal Information', page: PersonalInfoPage , icon:'person', show: true, sup:'' },
    //               { id: 1, name: 'Vital Medical Conditions', page: VitalMedicalPage, icon: 'warning', show: true, sup:'' },
    //               { id: 2, name: 'Emergency Contacts', page: EmergencyPage, icon:'contacts-book', show: true, sup:'' },
    //               { id: 3, name: 'Allergies', page: AllergiesPage, icon:'eye', show: true, sup:'' },
    //               { id: 4, name: 'Medications', page: MedicationsPage, icon:'pill',  show: true, sup:'' },
    //               { id: 5, name: 'Physicians', page: PhysiciansPage, icon:'doctor', show: true, sup:'' },
    //               { id: 6, name: 'Insurance Information', page: InsuranceInfoPage, icon:'umbrella', show: true, sup:'' },
    //               { id: 7, name: 'Surgries', page: SurgeriesPage, icon:'surgeon', show: false, sup:'' },
    //               { id: 8, name: 'Labs', page: LabsPage, icon:'test-tube', show: false, sup:'' },
    //               { id: 9, name: 'Living Will', page: LivingWillPage, icon:'document-scroll-2', show: false, sup:'' },
    //               { id: 10, name: 'DNR', page: DNRPage, icon:'document-lines', show: false, sup:'' },
    //               { id: 11, name: 'Family History', page: FamilyHistoryPage, icon:'family', show: false, sup:'' },
    //               { id: 12, name: 'Immunizations', page: ImmunizationsPage, icon:'syringe', show: false, sup:'' },
    //               { id: 13, name: 'Pharmacies', page: PharmaciesPage, icon:'medical-kit', show: false, sup:'' },
    //               { id: 14, name: 'SureCell', page: SureCellPage, icon:'atom', show: false, sup:'TM' },
    //               { id: 15, name: 'Other Info', page: OtherInfoPage, icon:'info', show: false, sup:'' },
    //               { id: 16, name: 'Pregnancy', page: PregnancyPage, icon:'baby-stroller', show: false, sup:'' },
    //             ];


    this.pagesList = {
      'PersonalInfoPage': 'PersonalInfoPage', 'VitalMedicalPage': 'VitalMedicalPage', 'EmergencyPage': 'EmergencyPage',
      'AllergiesPage': 'AllergiesPage', 'MedicationsPage': 'MedicationsPage', 'PhysiciansPage': 'PhysiciansPage',
      'InsuranceInfoPage': 'InsuranceInfoPage', 'OtherInfoPage': 'OtherInfoPage', 'SurgeriesPage': 'SurgeriesPage',
      'LabsPage': 'LabsPage', 'LivingWillPage': 'LivingWillPage', 'DNRPage': 'DNRPage', 'FamilyHistoryPage': 'FamilyHistoryPage',
      'ImmunizationsPage': 'ImmunizationsPage', 'PharmaciesPage': 'PharmaciesPage', 'PregnancyPage': 'PregnancyPage',
      'MedicalImagingPage': 'MedicalImagingPage'
    };

    this.pages = [{ id: 0, name: 'Personal Information', page: 'PersonalInfoPage', icon: 'person', show: true, sup: '' },
    { id: 1, name: 'Vital Medical Conditions', page: 'VitalMedicalPage', icon: 'warning', show: true, sup: '' },
    { id: 2, name: 'Emergency Contacts', page: 'EmergencyPage', icon: 'contacts-book', show: true, sup: '' },
    { id: 3, name: 'Allergies', page: 'AllergiesPage', icon: 'eye', show: true, sup: '' },
    { id: 4, name: 'Medications', page: 'MedicationsPage', icon: 'pill', show: true, sup: '' },
    { id: 5, name: 'Physicians', page: 'PhysiciansPage', icon: 'doctor', show: true, sup: '' },
    { id: 6, name: 'Insurance Information', page: 'InsuranceInfoPage', icon: 'umbrella', show: true, sup: '' },
    { id: 7, name: 'Other Info', page: 'OtherInfoPage', icon: 'info', show: false, sup: '' }
    ];




    this.relationship = 'edit';

    this.lists = [{ 'name': 'flask' }, { 'name': 'wifi' }, { 'name': 'beer' }, { 'name': 'football' },
    { 'name': 'basketball' }, { 'name': 'paper' }, { 'name': 'plane' }, { 'name': 'american' },
    { 'name': 'boat' }, { 'name': 'bluetooth' }, { 'name': 'build' }];
    this.slug = [];
    console.log('slug', this.slug);
    this.parents = [];
    console.log('parents', this.parents);
    this.getData();
  }

  swipe(swiper) {
    this.profile_id = this.profiles[swiper.activeIndex].id;

    this.personData = this.profiles[swiper.activeIndex].person;
    this.subscription_type = this.profiles[swiper.activeIndex].subscription_type;
    if (this.relationship == 'document' && this.subscription_type == 'Premium') {
      this.getDocument();
    }
  }

  // ionViewDidLoad() {
  //     this.setFilteredItems();
  //   }

  getData(){
    let loading = this.loadingCtrl.create({
      content: 'Loading Profiles'
    });
        loading.present();


    this.storage.get('pages').then(val=>{
      if(val){
        this.pages = val;
        this.addedCategories = [];
        this.pages.map((page) => {
          this.addedCategories.push(page.id);
        });
      }
    });

    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.getProfiles(this.email, this.auth_token)
          .subscribe(
            (data) => {
              if(data.success == false){
                loading.dismiss();
              }else{
                loading.dismiss();
                 this.isLoading = true;
                 this.profiles = data.profiles;
                 this.profile_id = this.profiles[0].id;
                 this.personData = this.profiles[0].person;
                 this.subscription_type = this.profiles[0].subscription_type;
                 this.storage.set('profileData', data.profiles);
             }
            },
          (data) => {
            loading.dismiss();
            console.log('internet Fails');
          });
      });
    });
  }

  optionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Link New Product',
          cssClass: 'custom-blue',
          handler: () => {
            this.goLinkNewPage();
          }
        },
        {
          text: 'Preview Profile',
          cssClass: 'custom-blue',
          handler: () => {
            this.goPreviewProfilePage();

          }
        },
        {
          text: 'Add Dependent Profile',
          cssClass: 'custom-blue',
          handler: () => {
            this.goAddDependentPage();
          }
        },
        {
          text: ' Delete Profile',
          cssClass: 'custom-red',
          role: 'destructive',
          handler: () => {
            this.deleteAlert();
          }
        }, {
          text: 'Cancel',
          cssClass: 'custom-cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  addCategoryPage() {

    let profileModal = this.modalCtrl.create('AddCategoryPage', { ids: this.addedCategories });
    profileModal.onDidDismiss(data => {
      if (data.value == 'show') {
        this.addedCategories = this.addedCategories.concat(data.category.id);
        this.pages.push(data.category);
        this.storage.set('pages', this.pages);
        this.navCtrl.push(this.pagesList[data.category.page], { profile_id: this.profile_id, personData: this.personData })
      } else if (data.value == 'hide') {
        this.addedCategories = this.addedCategories.concat(data.category.id);
        this.pages.push(data.category);
        this.storage.set('pages', this.pages);
      }
    });
    profileModal.present();
  }

  goLinkedProductPage() {
    this.navCtrl.push('LinkedProductPage', { profile_id: this.profile_id, personData: this.personData });
  }

  goAddDependentPage() {
    let profileModal = this.modalCtrl.create('AddDependentPage', {
      profile_id: this.profile_id
    });
    profileModal.present();
  }

  goPreviewProfilePage() {
    let profileModal = this.modalCtrl.create('PreviewProfilePage');
    profileModal.present();
  }

  goLinkNewPage() {
    let profileModal = this.modalCtrl.create('LinkNewPage');
    profileModal.present();
  }

  goManageSharingPage() {
    this.navCtrl.push('ManageSharingPage');
  }

  explainSlidePage() {
    let profileModal = this.modalCtrl.create('ExplainSlidePage', { personData: this.personData });
    profileModal.present();
  }

  deleteAlert() {
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: 'Do you want to delete this Profile?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.deleteProfile();
          }
        }
      ]
    });
    alert.present();
  }

  deleteProfile() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.userService.deleteProfile(this.auth_token, this.email, this.profile_id)
      .subscribe(
      (data) => {
        loading.dismiss();
        if (data.success == false) {
        } else {
          this.getData();
        }
      },
      (data) => {
        loading.dismiss();
        console.log("Login error");
      });
  }

  onPageClick(event, page) {
    this.navCtrl.push(this.pagesList[page], { profile_id: this.profile_id, personData: this.personData });
  }

  segmentChanged(event) {
    this.relationship = event.value;
  }

  onItemClick(item, profile_id) {

    this.parent_id = item.id;

    if (item.item_type == "folder") {
      let slug = this.slug.push(item.slug);
      let parents = this.parents.push(item.id);
      this.itemName = item.name;
      this.getDocument()
    }
    else {

      const options: InAppBrowserOptions = {
        zoom: 'no',
        location: 'no',
        closebuttoncaption: '< Back',
        toolbarposition: 'bottom',
        toolbar: 'yes'
      }
      const browser = this.inAppBrowser.create(item.url, '_blank', options);
    }
  }

  cancelSelect() {
    this.checkbox_flag = 0;
  }

  check1(id) {
    let index = this.selected_ids.indexOf(id);
    if (index > -1) {
      this.selected_ids.splice(index, 1);
    }
    else {
      this.selected_ids.push(id);
    }
  }

  getDocument() {
    console.log('slug');
    let slug;
    for (let i = 0; i < this.slug.length; i++) {
      slug = this.slug[i];
      this.slugValue = slug;
      console.log(this.slugValue);
    }

    this.getDocumentData(slug);
  }

  getPreviewDocument() {
    let slug;
    let parents;
    this.slug.pop();
    for (let i = 0; i < this.slug.length; i++) {
      slug = this.slug[i];
      this.slugValue = slug;
    }
    this.parents.pop();
    if (this.parents.length == 0) {
      this.parent_id = "";
      console.log('parent_id', this.parent_id)
    } else {
      for (let j = 0; j < this.parents.length; j++) {
        parents = this.parents[j];
        this.parent_id = parents;
        console.log('parent_id', parents)
      }
    }

    this.getDocumentData(slug);
  }

  getDocumentData(slug) {
    this.documents = [];
    let loading = this.loadingCtrl.create();
    loading.present();

    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;

        this.userService.getDocuments(this.email, this.auth_token, this.profile_id, slug)
          .subscribe(
          (data) => {
            loading.dismiss();
            if (data.success == false) {
              console.log("get Documents:" + JSON.stringify(data));
            } else {

              this.documents = data.items;
              this.groupContacts(this.documents);
            }
          },
          (data) => {
            loading.dismiss();
          });
      });
    });
  }



  groupContacts(documents) {

    let sortedContacts = documents.sort(function (a, b) {
      let aa: any = '';
      let bb: any = '';
      if (a.name) {
        aa = a.name.toLowerCase();
      } else {
        aa = a.file_name.toLowerCase();
      }

      if (b.name) {
        bb = b.name.toLowerCase();
      } else {
        bb = b.file_name.toLowerCase();
      }
      return aa > bb;
    });

    console.log("sortedContacts", sortedContacts);
    // let sortedContacts = documents.sort();
    let currentLetter = '';
    let currentContacts = [];
    this.groupedContacts = [];

    sortedContacts.forEach((value, index) => {

      let aa = '';
      if (value.name) {
        aa = value.name.toUpperCase();
      } else {
        aa = value.file_name.toUpperCase();
      }

      if (aa.charAt(0) != currentLetter) {

        currentLetter = aa.charAt(0);

        let newGroup = {
          letter: currentLetter,
          contacts: []
        };

        currentContacts = newGroup.contacts;
        this.groupedContacts.push(newGroup);

      }

      currentContacts.push(value);

    });

  }

  filterItems(searchItem){
    return this.documents.filter((item) => {
      let newItem = item.file_name?item.file_name:item.name;
      return newItem.toLowerCase().indexOf(searchItem.toLowerCase()) > -1;
    });
  }
  setFilteredItems() {

    let newDoc = this.filterItems(this.searchItem);
    console.log('newDoc', newDoc);
    this.groupContacts(newDoc);
  }


  deleteItems() {
    if (this.selected_ids.length > 0) {
      let loading = this.loadingCtrl.create();
      loading.present();

      this.storage.get('email').then(val => {
        this.email = val;
        this.storage.get('auth_token').then(val => {
          this.auth_token = val;
          if (this.profile_id == undefined) {
            this.profile_id = this.profile_id;
          }
          this.userService.deleteDocuments(this.email, this.auth_token, this.profile_id, this.selected_ids)
            .subscribe(
            (data) => {
              if (data.success == false) {
                console.log("get Documents:" + JSON.stringify(this.profiles));
              } else {

              }
              this.userService.deleteFolders(this.email, this.auth_token, this.profile_id, this.selected_ids)
                .subscribe(
                (data) => {
                  loading.dismiss();
                  if (data.success == false) {
                    console.log("get Documents:" + JSON.stringify(data));
                  } else {

                  }
                  this.getDocument();
                  this.checkbox_flag = 0;
                },
                (data) => {
                  loading.dismiss();
                  console.log("get Documents:" + JSON.stringify(data));
                });
            },
            (data) => {
              loading.dismiss();
            });
        });
      });
    }
  }

  selectOptions(myEvent) {
    let data = { 'profile_id': this.profile_id, 'parent_id': this.parent_id, 'sort_flag': '' };
    console.log("dataaa", data);
    let popover = this.popOverCtrl.create('PopoverContentPage', data);
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss((popoverData) => {
      if (popoverData == '1') {
        this.checkbox_flag = 1;
        this.selected_ids = [];
        console.log(this.checkbox_flag);
      }
      // else if (popoverData == 'name'){
      //   this.sort_flag = popoverData;
      //   this.getDocument();
      // }
      // else if (popoverData == 'date'){
      //   this.sort_flag = popoverData;
      //   this.getDocument();
      // }
      else {
        this.getDocument();
      }
    })
  }

  moreOptions(item) {
    console.log('item', item);
    if (item.item_type == 'folder') {
      let actionSheet = this.actionSheetCtrl.create({
        title: item.name,
        subTitle: "",
        buttons: [
          {
            text: 'Share Folder',
            handler: () => {
              this.shareDocument(item);
            }
          }
          ,{
            text: 'Rename Folder',
            handler: () => {
              this.renameAlert(item);
            }
          }
          , {
            text: 'Move Folder',
            handler: () => {

              this.moveItem(item);
            }
          }, {
            text: 'Delete Folder',
            role: 'destructive',
            handler: () => {
              let ids = [];
              ids.push(item.id);
              console.log(ids);
              this.deleteFolder(ids);
            }
          }, {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }
    else {
      let actionSheet = this.actionSheetCtrl.create({
        title: item.name,
        subTitle: "",
        buttons: [
          {
            text: 'Share File',
            handler: () => {
              this.shareDocument(item);
            }
          }, {
            text: 'Rename File',
            handler: () => {
              this.renameAlert(item);
            }
          }, {
            text: 'Move File',
            handler: () => {
              this.moveItem(item);
            }
          }, {
            text: 'Delete File',
            role: 'destructive',
            handler: () => {
              let ids = [];
              ids.push(item.id);
              console.log(ids);
              this.deleteDocument(ids);
            }
          }, {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }
  }

  shareDocument(item) {
    let profileModal = this.modalCtrl.create('ShareDocumentPage', { profile_id: this.profile_id, item: item });
    profileModal.present();

  }
  renameAlert(item) {
    let prompt = this.alertCtrl.create({
      title: 'New name',
      message: "Enter a new folder name",
      inputs: [
        {
          name: 'title',
          value: item.name,
          placeholder: '–'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            console.log('OK clicked');
            console.log(data);
            if (item.item_type == 'folder') {
              this.renameFolder(item.id, data.title);
            } else {
              this.renameDocument(item.id, data.title);
            }


          }
        }
      ]
    });
    prompt.present();
  }



  shareEmail() {
    console.log('shareData', this.share);
    this.share.in_timezone = 'America/New_York';
    let share_date = new Date(this.share.expired_at);
    let expired_at = share_date.getTime().toString();
    console.log(expired_at);

    let body = {
      "profile_id": this.profile_id.toString(), "identity": { share_profile: "true" }, "share": {
        "expired_at": expired_at,
        "in_timezone": "America/New_York",
        "message": this.share.message,
        "password": this.share.password,
        "shared_email": [this.share.shared_email]
      }
    }
    console.log(body);
    let loading = this.loadingCtrl.create();
    console.log(body);
    loading.present();
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        this.userService.ShareProfile(this.email, this.auth_token, body)
          .subscribe(
          (data) => {
            loading.dismiss();
            console.log("share Data: ", data);
            if (data.success == false) {
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Create Error", buttons: ['OK']
              });
              alert.present();
            } else {
              this.goSuccessPage();
              // alert.present();
              console.log(data);
            }
          });
      });
    });
  }

  goSuccessPage() {
    let profileModal = this.modalCtrl.create('SuccessPage', { value: 'share' });
    profileModal.present();
  }

  deleteFolder(folder_id) {

    let loading = this.loadingCtrl.create();

    loading.present();
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;

        this.userService.deleteFolders(this.email, this.auth_token, this.profile_id, folder_id)
          .subscribe(
          (data) => {
            loading.dismiss();
            if (data.success == false) {
              console.log("get Documents:" + JSON.stringify(data));
            } else {
              console.log("get Documents:" + JSON.stringify(data));
            }
            this.getDocument();
            this.checkbox_flag = 0;
          },
          (data) => {
            loading.dismiss();
            console.log("get Documents:" + JSON.stringify(data));
          });
      });
    });
  }

  deleteDocument(document_id) {

    let loading = this.loadingCtrl.create();

    loading.present();
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;

        this.userService.deleteDocument(this.email, this.auth_token, this.profile_id, document_id)
          .subscribe(
          (data) => {
            loading.dismiss();
            if (data.success == false) {
              console.log("get Documents:" + JSON.stringify(data));
            } else {
              console.log("get Documents:" + JSON.stringify(data));
            }
            this.getDocument();
            this.checkbox_flag = 0;
          },
          (data) => {
            loading.dismiss();
            console.log("get Documents:" + JSON.stringify(data));
          });
      });
    });
  }

  renameFolder(folder_id, name) {

    let loading = this.loadingCtrl.create();

    loading.present();
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        if (this.profile_id == undefined) {
          this.profile_id = this.profile_id;
        }

        this.userService.renameFolder(this.email, this.auth_token, this.profile_id, folder_id, name)
          .subscribe(
          (data) => {
            loading.dismiss();
            if (data.success == false) {
              console.log("get Documents:" + JSON.stringify(data));
            } else {
              console.log("get Documents:" + JSON.stringify(data));
            }
            this.getDocument();
            this.checkbox_flag = 0;
          },
          (data) => {
            loading.dismiss();
          });
      });
    });
  }

  renameDocument(file_id, name) {

    let loading = this.loadingCtrl.create();

    loading.present();
    this.storage.get('email').then(val => {
      this.email = val;
      this.storage.get('auth_token').then(val => {
        this.auth_token = val;
        if (this.profile_id == undefined) {
          this.profile_id = this.profile_id;
        }

        this.userService.renameDocument(this.email, this.auth_token, this.profile_id, file_id, name)
          .subscribe(
          (data) => {
            loading.dismiss();
            if (data.success == false) {
              console.log("get Documents:" + JSON.stringify(data));
            } else {
              console.log("get Documents:" + JSON.stringify(data));
            }
            this.getDocument();
            this.checkbox_flag = 0;
          },
          (data) => {
            loading.dismiss();
            console.log("get Documents:" + JSON.stringify(data));
          });
      });
    });
  }

  moveItem(item) {
    console.log('moveFolder');

    let profileModal = this.modalCtrl.create('MoveDocumentPage', { profile_id: this.profile_id, oldItem: item });
    profileModal.present();

  }

}
