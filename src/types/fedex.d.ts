export interface IFedexDelivery {
	mergeLabelDocOption?: string,
	requestedShipment?: {
		shipDatestamp?: string, 
		totalDeclaredValue?: IDeclaredValue,
		shipper: IFedexUser,
		soldTo?: IFedexUser,
		recipients: IFedexUser[],
		recipientLocationNumber?: number,
		pickupType: string,
		serviceType: string,
		packagingType: string,
		totalWeight?: number,
		origin?: IFedexUser,
		shippingChargesPayment: {
			paymentType: string,
			payor?: {
				responsibleParty?: IFedexUser
			}
		},
		shipmentSpecialServices?: IShipmentSpecialServices,
		emailNotificationDetail?: IEmailNotificationDetail,
		expressFreightDetail?: IExpressFreightDetail,
		variableHandlingChargeDetail?: IVariableHandlingChargeDetail,
		customsClearanceDetail?: ICustomsClearanceDetail,
		smartPostInfoDetail?: ISmartPostInfoDetail,
		blockInsightVisibility?: boolean,
		labelSpecification: ILabelSpecification,
		shippingDocumentSpecification?: IShippingDocumentSpecification,
		rateRequestType?: string[],
		preferredCurrency?: string,
		totalPackageCount?: number,
		masterTrackingId?: IMasterTrackingId,
		requestedPackageLineItems: IRequestedPackageLineItem[],
	}, 	
	labelResponseOptions: string,
	accountNumber: {
			value: string
	},
	shipAction?: string,
	processingOptionType?: string;
	oneLabelAtATime?: boolean;
}



export interface IDeclaredValue { 
	amount?: number,
	currency?: string,
}

export interface IFedexUser { 
	//:
	address: {
		streetLines?: string[];
		city?: string;
		stateOrProvinceCode?: string;
		postalCode?: string;
		countryCode?: string;
		residential?: boolean;
	  },
	  //:
	  contact: { 
		personName?: string;
		emailAddress?: string;
		phoneNumber?: string;
		phoneExtension?: string; 
		companyName?: string;
		faxNumber?: string;
	  },
	  tins?: {
		number?: string;
		tinType?: string;
		usage?: string;
		effectiveDate?: string; // timestamp는 문자열로 정의
		expirationDate?: string; // timestamp는 문자열로 정의
	  }[],
	  accountNumber?: { 
		value?: string
	  },
	  deliveryInstructions?: string; 
	}

	export interface IShipmentSpecialServices {
		specialServiceTypes?: string[];
		etdDetail?: {
		  attributes?: string[];
		  attachedDocuments?: {
			documentType?: string;
			documentReference?: string;
			description?: string;
			documentId?: string;
		  }[];
		  requestedDocumentTypes?: string[];
		};
		returnShipmentDetail?: {
		  returnEmailDetail?: {
			merchantPhoneNumber?: string;
			allowedSpecialService?: string[];
		  };
		  rma?: {
			reason?: string;
		  };
		  returnAssociationDetail?: {
			shipDatestamp?: string;
			trackingNumber?: string;
		  };
		  returnType?: string;
		};
		deliveryOnInvoiceAcceptanceDetail?: {
		  recipient?: IFedexUser;
		};
		internationalTrafficInArmsRegulationsDetail?: {
		  licenseOrExemptionNumber?: string;
		};
		pendingShipmentDetail?: {
		  pendingShipmentType?: string;
		  processingOptions?: {
			options?: string[];
		  };
		  recommendedDocumentSpecification?: {
			types?: string;
		  };
		  emailLabelDetail?: {
			recipients?: {
			  emailAddress?: string;
			  optionsRequested?: {
				options?: string[];
			  };
			  role?: string;
			  locale?: string;
			}[];
			message?: string;
		  };
		  attachedDocuments?: {
			documentType?: string;
			documentReference?: string;
			description?: string;
			documentId?: string;
		  }[];
		  expirationTimeStamp?: string;
		};
		holdAtLocationDetail?: {
		  locationId?: string;
		  locationContactAndAddress?: IFedexUser;
		  locationType?: string;
		};
		shipmentCODDetail?: {
		  addTransportationChargesDetail?: {
			rateType?: string;
			rateLevelType?: string;
			chargeLevelType?: string;
			chargeType?: string;
		  };
		  codRecipient?: IFedexUser;
		  remitToName?: string;
		  codCollectionType?: string;
		  financialInstitutionContactAndAddress?: IFedexUser;
		  codCollectionAmount?: IDeclaredValue;
		  returnReferenceIndicatorType?: string;
		  shipmentCodAmount?: IDeclaredValue;
		};
		shipmentDryIceDetail?: {
		  totalWeight?: {
			units?: string;
			value?: number;
		  };
		  packageCount?: number;
		};
		internationalControlledExportDetail?: {
		  licenseOrPermitExpirationDate?: string;
		  licenseOrPermitNumber?: string;
		  entryNumber?: string;
		  foreignTradeZoneCode?: string;
		  type?: string;
		};
		homeDeliveryPremiumDetail?: {
		  phoneNumber?: {
			areaCode?: string;
			localNumber?: string;
			extension?: string;
			personalIdentificationNumber?: string;
		  };
		  deliveryDate?: string;
		  homedeliveryPremiumType?: string;
		};
	  }

	  export interface IEmailNotificationDetail { 
		aggregationType?: string;
		emailNotificationRecipients?: [{
			name?: string;
  			emailNotificationRecipientType?: string;
  			emailAddress?: string;
  			notificationFormatType?: string;
  			notificationType?: string;
  			locale?: string;
  			notificationEventType?: string[];
		}],
		personalMessage?: string;

	  }

	export interface IExpressFreightDetail{ 
		bookingConfirmationNumber?: string;
		shippersLoadAndCount?: number;
		packingListEnclosed?: boolean;
	}

	export interface IVariableHandlingChargeDetail{
		rateType?: string;
		percentValue?: number;
		rateLevelType?: string;
		fixedValue?: {
			amount?: number;
			currency?: string;
		};
		rateElementBasis?: string;
	}

	export interface ICustomsClearanceDetail {
		regulatoryControls?: string;
		brokers?: {
		  broker: IFedexUser;
		  type?: string;
		}[];
		commercialInvoice?: {
		  originatorName?: string;
		  comments?: string[];
		  customerReferences?: {
			customerReferenceType?: string;
			value?: string;
		  }[];
		  taxesOrMiscellaneousCharge?: IDeclaredValue;
		  taxesOrMiscellaneousChargeType?: string;
		  freightCharge?: IDeclaredValue;
		  packingCosts?: IDeclaredValue;
		  handlingCosts?: IDeclaredValue;
		  declarationStatement?: string;
		  termsOfSale?: string;
		  specialInstructions?: string;
		  shipmentPurpose?: string;
		  emailNotificationDetail?: {
			emailAddress?: string;
			type?: string;
			recipientType?: string;
		  };
		};
		freightOnValue?: string;
		dutiesPayment?: {
		  payor?: {
			responsibleParty?: IFedexUser;
		  };
		};
		billingDetails?: {
		  billingCode?: string;
		  billingType?: string;
		  aliasId?: string;
		  accountNickname?: string;
		  accountNumber?: string;
		  accountNumberCountryCode?: string;
		};
		paymentType?: string;
		commodities?: {
		  unitPrice?: IDeclaredValue;
		  additionalMeasures?: {
			quantity?: number;
			units?: string;
		  }[];
		  numberOfPieces?: number;
		  quantity?: number;
		  quantityUnits?: string;
		  customsValue?: IDeclaredValue;
		  countryOfManufacture?: string;
		  cIMarksAndNumbers?: string;
		  harmonizedCode?: string;
		  description?: string;
		  name?: string;
		  weight?: {
			units?: string;
			value?: number;
		  };
		  exportLicenseNumber?: string;
		  exportLicenseExpirationDate?: string;
		  partNumber?: string;
		  purpose?: string;
		  usmcaDetail?: {
			originCriterion?: string;
		  };
		}[];
		isDocumentOnly?: boolean;
		recipientCustomsId?: {
		  type?: string;
		  value?: string;
		};
		customsOption?: {
		  description?: string;
		  type?: string;
		};
		importerOfRecord?: IFedexUser;
		generatedDocumentLocale?: string;
		exportDetail?: {
		  destinationControlDetail?: {
			endUser?: string;
			statementTypes?: string;
			destinationCountries?: string[];
		  };
		  b13AFilingOption?: string;
		  exportComplianceStatement?: string;
		  permitNumber?: string;
		};
		totalCustomsValue?: IDeclaredValue;
		partiesToTransactionAreRelated?: boolean;
		declarationStatementDetail?: {
		  usmcaLowValueStatementDetail?: {
			countryOfOriginLowValueDocumentRequested?: boolean;
			customsRole?: string;
		  };
		};
		insuranceCharge?: IDeclaredValue;
	  }
	  

	  export interface ISmartPostInfoDetail{
		ancillaryEndorsement?: string;
		hubId?: string
		indicia?: string
		specialServices?: string
	  }

	  export interface ILabelSpecification {
		labelFormatType?: string;
		labelOrder?: string;
		customerSpecifiedDetail?: {
		  maskedData?: string[];
		  regulatoryLabels?: {
			generationOptions?: string;
			type?: string;
		  }[];
		  additionalLabels?: {
			type?: string;
			count?: number;
		  }[];
		  docTabContent?: {
			docTabContentType?: string;
			zone001?: {
			  docTabZoneSpecifications?: {
				zoneNumber?: number;
				header?: string;
				dataField?: string;
				literalValue?: string;
				justification?: string;
			  }[];
			};
			barcoded?: {
			  symbology?: string;
			  specification?: {
				zoneNumber?: number;
				header?: string;
				dataField?: string;
				literalValue?: string;
				justification?: string;
			  };
			};
		  };
		};
		printedLabelOrigin?: {
		  address?: {
			streetLines?: string[];
			city?: string;
			stateOrProvinceCode?: string;
			postalCode?: string;
			countryCode?: string;
			residential?: boolean;
		  };
		  contact?: {
			personName?: string;
			emailAddress?: string;
			phoneNumber?: string;
			phoneExtension?: string;
			companyName?: string;
			faxNumber?: string;
		  };
		};
		labelStockType: string;
		labelRotation?: string;
		imageType: string;
		labelPrintingOrientation?: string;
		returnedDispositionDetail?: boolean;
	  }
	  

	  export interface IShippingDocumentSpecification {
		generalAgencyAgreementDetail?: {
		  documentFormat?: {
			provideInstructions?: boolean;
			optionsRequested?: {
			  options?: string[];
			};
			stockType?: string;
			dispositions?: {
			  eMailDetail?: {
				eMailRecipients?: {
				  emailAddress?: string;
				  recipientType?: string;
				}[];
				locale?: string;
				grouping?: string;
			  };
			  dispositionType?: string;
			}[];
			locale?: string;
			docType?: string;
		  };
		};
		returnInstructionsDetail?: {
		  customText?: string;
		  documentFormat?: {
			provideInstructions?: boolean;
			optionsRequested?: {
			  options?: string[];
			};
			stockType?: string;
			dispositions?: {
			  eMailDetail?: {
				eMailRecipients?: {
				  emailAddress?: string;
				  recipientType?: string;
				}[];
				locale?: string;
				grouping?: string;
			  };
			  dispositionType?: string;
			}[];
			locale?: string;
			docType?: string;
		  };
		};
		op900Detail?: {
		  customerImageUsages?: {
			id?: string;
			type?: string;
			providedImageType?: string;
		  }[];
		  signatureName?: string;
		  documentFormat?: {
			provideInstructions?: boolean;
			optionsRequested?: {
			  options?: string[];
			};
			stockType?: string;
			dispositions?: {
			  eMailDetail?: {
				eMailRecipients?: {
				  emailAddress?: string;
				  recipientType?: string;
				}[];
				locale?: string;
				grouping?: string;
			  };
			  dispositionType?: string;
			}[];
			locale?: string;
			docType?: string;
		  };
		};
		usmcaCertificationOfOriginDetail?: {
		  customerImageUsages?: {
			id?: string;
			type?: string;
			providedImageType?: string;
		  }[];
		  documentFormat?: {
			provideInstructions?: boolean;
			optionsRequested?: {
			  options?: string[];
			};
			stockType?: string;
			dispositions?: {
			  eMailDetail?: {
				eMailRecipients?: {
				  emailAddress?: string;
				  recipientType?: string;
				}[];
				locale?: string;
				grouping?: string;
			  };
			  dispositionType?: string;
			}[];
			locale?: string;
			docType?: string;
		  };
		  certifierSpecification?: string;
		  importerSpecification?: string;
		  producerSpecification?: string;
		  producer?: {
			address?: {
			  streetLines?: string[];
			  city?: string;
			  stateOrProvinceCode?: string;
			  postalCode?: string;
			  countryCode?: string;
			  residential?: boolean;
			};
			contact?: {
			  personName?: string;
			  emailAddress?: string;
			  phoneExtension?: string;
			  phoneNumber?: string;
			  companyName?: string;
			};
			accountNumber?: {
			  value?: string;
			};
			tins?: {
			  number?: string;
			  tinType?: string;
			  usage?: string;
			  effectiveDate?: string;
			  expirationDate?: string;
			}[];
		  };
		  blanketPeriod?: {
			begins?: string;
			ends?: string;
		  };
		  certifierJobTitle?: string;
		};
		usmcaCommercialInvoiceCertificationOfOriginDetail?: {
		  customerImageUsages?: {
			id?: string;
			type?: string;
			providedImageType?: string;
		  }[];
		  documentFormat?: {
			provideInstructions?: boolean;
			optionsRequested?: {
			  options?: string[];
			};
			stockType?: string;
			dispositions?: {
			  eMailDetail?: {
				eMailRecipients?: {
				  emailAddress?: string;
				  recipientType?: string;
				}[];
				locale?: string;
				grouping?: string;
			  };
			  dispositionType?: string;
			}[];
			locale?: string;
			docType?: string;
		  };
		  certifierSpecification?: string;
		  importerSpecification?: string;
		  producerSpecification?: string;
		  producer?: {
			address?: {
			  streetLines?: string[]; 
			  city?: string;
			  stateOrProvinceCode?: string;
			  postalCode?: string;
			  countryCode?: string;
			  residential?: boolean;
			};
			contact?: {
			  personName?: string;
			  emailAddress?: string;
			  phoneExtension?: string;
			  phoneNumber?: string;
			  companyName?: string;
			};
			accountNumber?: {
			  value?: string;
			};
			tins?: {
			  number?: string;
			  tinType?: string;
			  usage?: string;
			  effectiveDate?: string;
			  expirationDate?: string;
			}[];
		  };
		  certifierJobTitle?: string;
		};
		shippingDocumentTypes?: string[];
		certificateOfOrigin?: {
		  customerImageUsages?: {
			id?: string;
			type?: string;
			providedImageType?: string;
		  }[];
		  documentFormat?: {
			provideInstructions?: boolean;
			optionsRequested?: {
			  options?: string[];
			};
			stockType?: string;
			dispositions?: {
			  eMailDetail?: {
				eMailRecipients?: {
				  emailAddress?: string;
				  recipientType?: string;
				}[];
				locale?: string;
				grouping?: string;
			  };
			  dispositionType?: string;
			}[];
			locale?: string;
			docType?: string;
		  };
		};
		commercialInvoiceDetail?: {
		  customerImageUsages?: {
			id?: string;
			type?: string;
			providedImageType?: string;
		  }[];
		  documentFormat?: {
			provideInstructions?: boolean;
			optionsRequested?: {
			  options?: string[];
			};
			stockType?: string;
			dispositions?: {
			  eMailDetail?: {
				eMailRecipients?: {
				  emailAddress?: string;
				  recipientType?: string;
				}[];
				locale?: string;
				grouping?: string;
			  };
			  dispositionType?: string;
			}[];
			locale?: string;
			docType?: string;
		  };
		};
	  }
	  
	  export interface IMasterTrackingId { 
		formId?: string;
		trackingIdType?: string;
		uspsApplicationId?: string;
		trackingNumber?: string;
	  }

	  export interface IRequestedPackageLineItem {
		sequenceNumber?: string;
		subPackagingType?: string;
		customerReferences?: {
		  customerReferenceType?: string;
		  value?: string;
		}[];
		declaredValue?: {
		  amount?: number;
		  currency?: string;
		};
		weight?: {
		  units?: string;
		  value?: number;
		};
		dimensions?: {
		  length?: number;
		  width?: number;
		  height?: number;
		  units?: string;
		};
		groupPackageCount?: number;
		itemDescriptionForClearance?: string;
		contentRecord?: {
		  itemNumber?: string;
		  receivedQuantity?: number;
		  description?: string;
		  partNumber?: string;
		}[];
		itemDescription?: string;
		variableHandlingChargeDetail?: {
		  rateType?: string;
		  percentValue?: number;
		  rateLevelType?: string;
		  fixedValue?: {
			amount?: number;
			currency?: string;
		  };
		  rateElementBasis?: string;
		};
		packageSpecialServices?: {
		  specialServiceTypes?: string[];
		  signatureOptionType?: string;
		  priorityAlertDetail?: {
			enhancementTypes?: string[];
			content?: string[];
		  };
		  signatureOptionDetail?: {
			signatureReleaseNumber?: string;
		  };
		  alcoholDetail?: {
			alcoholRecipientType?: string;
			shipperAgreementType?: string;
		  };
		  dangerousGoodsDetail?: {
			cargoAircraftOnly?: boolean;
			accessibility?: string;
			options?: string[];
		  };
		  packageCODDetail?: {
			codCollectionAmount?: {
			  amount?: number;
			  currency?: string;
			};
		  };
		  pieceCountVerificationBoxCount?: number;
		  batteryDetails?: {
			batteryPackingType?: string;
			batteryRegulatoryType?: string;
			batteryMaterialType?: string;
		  }[];
		  dryIceWeight?: {
			units?: string;
			value?: number;
		  };
		};
		trackingNumber?: string;
	  }
	  
