// State Rights Data - General informational summaries only
// This content is for general informational purposes only and does not constitute legal advice.
// Laws vary by state and change frequently. Consult a licensed attorney for specific legal questions.

export interface StateRightsCategory {
  id: string
  state_code: string
  state_name: string
  category: string
  title: string
  official_summary: string
  plain_language: string
  key_points: string[]
  helpful_links: { title: string; url: string }[]
  last_updated: string
}

export interface StateRightsData {
  [stateCode: string]: StateRightsCategory[]
}

const generateStateRights = (stateCode: string, stateName: string): StateRightsCategory[] => {
  // Default template for states
  return [
    {
      id: `${stateCode}-tenant`,
      state_code: stateCode,
      state_name: stateName,
      category: "landlord_tenant",
      title: `${stateName} Tenant Rights Overview`,
      official_summary: `${stateName} landlord-tenant law establishes the legal framework governing rental agreements, security deposits, eviction procedures, and habitability standards. Tenants have statutory rights regarding notice periods, repairs, and lease termination that landlords must observe.`,
      plain_language: `As a renter in ${stateName}, you have basic rights that protect you. Your landlord must keep your home safe and livable, give you proper notice before entering, and follow specific rules when returning your security deposit or starting an eviction. Understanding these rights helps you advocate for yourself.`,
      key_points: [
        "Security deposits are typically limited and must be returned within a specific timeframe after move-out",
        "Landlords must provide habitable living conditions including working plumbing, heating, and electricity",
        "Proper written notice is generally required before eviction proceedings can begin",
        "Tenants typically have the right to withhold rent or repair-and-deduct for serious habitability issues",
        "Retaliation against tenants for exercising legal rights is generally prohibited"
      ],
      helpful_links: [
        { title: `${stateName} Attorney General`, url: `https://www.naag.org/` },
        { title: "HUD Tenant Rights", url: "https://www.hud.gov/topics/rental_assistance/tenantrights" },
        { title: "Legal Aid Resources", url: "https://www.lawhelp.org/" }
      ],
      last_updated: new Date().toISOString()
    },
    {
      id: `${stateCode}-consumer`,
      state_code: stateCode,
      state_name: stateName,
      category: "consumer_protection",
      title: `${stateName} Consumer Protection Overview`,
      official_summary: `${stateName} consumer protection statutes prohibit unfair and deceptive trade practices. The state attorney general and relevant agencies enforce these laws, which cover advertising, sales practices, warranties, and consumer transactions.`,
      plain_language: `${stateName} has laws to protect you from scams, fraud, and unfair business practices. If a company lies to you, sells you defective products, or uses deceptive tactics, you may have legal options. You can file complaints with state agencies and may be entitled to refunds or damages.`,
      key_points: [
        "Deceptive advertising and false claims are prohibited under state law",
        "Consumers may have the right to cancel certain contracts within a cooling-off period",
        "Lemon laws may protect purchasers of defective vehicles",
        "The state attorney general can investigate consumer complaints",
        "Small claims court provides an accessible option for resolving disputes"
      ],
      helpful_links: [
        { title: `${stateName} Consumer Protection`, url: `https://www.usa.gov/state-consumer` },
        { title: "FTC Consumer Information", url: "https://consumer.ftc.gov/" },
        { title: "Better Business Bureau", url: "https://www.bbb.org/" }
      ],
      last_updated: new Date().toISOString()
    },
    {
      id: `${stateCode}-hoa`,
      state_code: stateCode,
      state_name: stateName,
      category: "hoa_rights",
      title: `${stateName} HOA Rights Overview`,
      official_summary: `Homeowners associations in ${stateName} are governed by state statutes, the association's declaration, bylaws, and rules. Members have rights regarding meetings, voting, access to records, and due process before fines or enforcement actions.`,
      plain_language: `If you live in a community with an HOA in ${stateName}, you have rights as a member. You can attend meetings, vote on important issues, and access financial records. The HOA must follow its own rules and give you notice before fining you or taking action against you.`,
      key_points: [
        "HOA members generally have the right to attend board meetings",
        "Access to association financial records and meeting minutes is typically required",
        "Due process protections usually apply before fines can be imposed",
        "Voting rights for elections and major decisions are established in governing documents",
        "Dispute resolution procedures may be available before litigation"
      ],
      helpful_links: [
        { title: "Community Associations Institute", url: "https://www.caionline.org/" },
        { title: `${stateName} Real Estate Commission`, url: "https://www.arello.org/" },
        { title: "HOA Resources", url: "https://www.hud.gov/" }
      ],
      last_updated: new Date().toISOString()
    }
  ]
}

// State-specific data with more detailed information for major states
const stateSpecificData: { [key: string]: StateRightsCategory[] } = {
  CA: [
    {
      id: "CA-tenant",
      state_code: "CA",
      state_name: "California",
      category: "landlord_tenant",
      title: "California Tenant Rights Overview",
      official_summary: "California Civil Code sections 1940-1954.06 establish comprehensive tenant protections including rent control in qualifying jurisdictions, just cause eviction requirements under AB 1482, security deposit limits of two months' rent (or three for furnished units), and strong habitability standards under the implied warranty of habitability.",
      plain_language: "California has some of the strongest tenant protections in the country. Your landlord can only raise rent by a limited amount each year (generally 5% plus inflation, capped at 10%) and needs a valid reason to evict you. Security deposits are limited, must be returned within 21 days, and your landlord must keep your home safe and livable.",
      key_points: [
        "Rent increases are capped at 5% plus local inflation (max 10%) for most properties built before 2005",
        "Security deposits cannot exceed 2 months' rent (3 months for furnished units)",
        "Landlords must return deposits within 21 days with itemized deductions",
        "Just cause eviction protections apply after 12 months of tenancy",
        "Tenants can withhold rent or repair-and-deduct for serious habitability issues",
        "Retaliation within 180 days of tenant complaints is presumed unlawful"
      ],
      helpful_links: [
        { title: "California Department of Consumer Affairs", url: "https://www.dca.ca.gov/" },
        { title: "California Tenant Rights - CA.gov", url: "https://www.courts.ca.gov/selfhelp-housing.htm" },
        { title: "California Civil Code", url: "https://leginfo.legislature.ca.gov/" }
      ],
      last_updated: new Date().toISOString()
    },
    {
      id: "CA-consumer",
      state_code: "CA",
      state_name: "California",
      category: "consumer_protection",
      title: "California Consumer Protection Overview",
      official_summary: "California's Consumer Legal Remedies Act (CLRA), Unfair Competition Law (UCL), and False Advertising Law provide broad protections against deceptive practices. The California Lemon Law (Song-Beverly Act) offers strong vehicle warranty protections.",
      plain_language: "California protects consumers with strong laws against fraud and deception. If you buy a defective car, the Lemon Law may entitle you to a replacement or refund. You can sue businesses for unfair practices, and the state actively prosecutes scams.",
      key_points: [
        "The Lemon Law covers new vehicles with substantial defects that cannot be repaired",
        "Consumers can sue for unfair business practices and may recover attorney fees",
        "30-day cooling off period applies to certain home solicitation sales",
        "Data privacy rights under CCPA give consumers control over personal information",
        "The Attorney General actively investigates consumer complaints"
      ],
      helpful_links: [
        { title: "California Attorney General Consumer Protection", url: "https://oag.ca.gov/consumers" },
        { title: "California Lemon Law Information", url: "https://www.dca.ca.gov/acp/lemon.shtml" },
        { title: "File a Consumer Complaint", url: "https://oag.ca.gov/contact/consumer-complaint-against-business-or-company" }
      ],
      last_updated: new Date().toISOString()
    },
    {
      id: "CA-hoa",
      state_code: "CA",
      state_name: "California",
      category: "hoa_rights",
      title: "California HOA Rights Overview",
      official_summary: "California's Davis-Stirling Common Interest Development Act (Civil Code 4000-6150) comprehensively regulates HOAs, requiring open meetings, access to records, dispute resolution procedures, and limitations on association power.",
      plain_language: "California HOA members have strong rights. You can attend almost all board meetings, access financial records, and the HOA must follow specific procedures before fining you. There are also limits on what HOAs can prohibit, like solar panels and drought-resistant landscaping.",
      key_points: [
        "Board meetings must be open to members with limited exceptions",
        "Members can access association records within 10 business days of request",
        "IDR (Internal Dispute Resolution) must be offered before most enforcement",
        "HOAs cannot prohibit solar panels, electric vehicle charging, or drought-tolerant landscaping",
        "Assessment increases over 20% require member approval"
      ],
      helpful_links: [
        { title: "Davis-Stirling Act", url: "https://www.davis-stirling.com/" },
        { title: "CA Department of Real Estate", url: "https://www.dre.ca.gov/" },
        { title: "California HOA Laws", url: "https://leginfo.legislature.ca.gov/" }
      ],
      last_updated: new Date().toISOString()
    }
  ],
  TX: [
    {
      id: "TX-tenant",
      state_code: "TX",
      state_name: "Texas",
      category: "landlord_tenant",
      title: "Texas Tenant Rights Overview",
      official_summary: "Texas Property Code Chapter 92 governs residential tenancies, establishing landlord obligations for security devices, property conditions, and security deposit returns within 30 days. Texas does not have statewide rent control.",
      plain_language: "Texas tenants have basic protections but fewer than some other states. Your landlord must provide working locks, smoke detectors, and keep the property habitable. Security deposits must be returned within 30 days. There is no rent control in Texas, so landlords can raise rent by any amount with proper notice.",
      key_points: [
        "No statewide rent control - landlords can raise rent with proper notice",
        "Security deposits must be returned within 30 days of move-out",
        "Landlords must provide working door locks, window latches, and smoke detectors",
        "Repair requests should be made in writing for documentation",
        "Landlords must make diligent efforts to re-rent if tenant breaks lease"
      ],
      helpful_links: [
        { title: "Texas Attorney General Consumer Protection", url: "https://www.texasattorneygeneral.gov/consumer-protection" },
        { title: "Texas Property Code", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.92.htm" },
        { title: "Texas Tenant Rights", url: "https://www.texaslawhelp.org/article/tenant-rights" }
      ],
      last_updated: new Date().toISOString()
    },
    {
      id: "TX-consumer",
      state_code: "TX",
      state_name: "Texas",
      category: "consumer_protection",
      title: "Texas Consumer Protection Overview",
      official_summary: "The Texas Deceptive Trade Practices Act (DTPA) prohibits false, misleading, or deceptive acts in consumer transactions. Consumers may recover actual damages, and in some cases treble damages, plus attorney fees.",
      plain_language: "Texas has strong consumer protection through the DTPA. If a business deceives you, sells you something defective, or engages in unfair practices, you can sue and potentially recover three times your actual damages plus attorney fees.",
      key_points: [
        "The DTPA covers false advertising, bait-and-switch, and failure to disclose defects",
        "Consumers may recover up to three times actual damages for knowing violations",
        "Attorney fees can be awarded to prevailing consumers",
        "Texas Lemon Law covers defective new vehicles",
        "60-day notice to the business is required before filing a DTPA lawsuit"
      ],
      helpful_links: [
        { title: "Texas DTPA Information", url: "https://www.texasattorneygeneral.gov/consumer-protection/file-consumer-complaint" },
        { title: "Texas Lemon Law", url: "https://www.txdmv.gov/motorists/consumer-protection/lemon-law" },
        { title: "Texas State Law Library", url: "https://www.sll.texas.gov/" }
      ],
      last_updated: new Date().toISOString()
    },
    {
      id: "TX-hoa",
      state_code: "TX",
      state_name: "Texas",
      category: "hoa_rights",
      title: "Texas HOA Rights Overview",
      official_summary: "Texas Property Code Chapter 209 regulates property owners' associations, requiring open meetings, access to records, and specific procedures for assessments and enforcement actions.",
      plain_language: "Texas HOA members have rights including attending meetings and accessing records. The HOA must give you notice before fining you and provide an opportunity to be heard. Recent laws have limited some HOA powers over things like flags and religious displays.",
      key_points: [
        "Members can attend open board meetings",
        "HOAs must provide access to books and records",
        "Written notice and hearing required before most fines",
        "HOAs cannot prohibit the Texas flag, US flag, or religious items on doors",
        "Payment plans must be offered for assessments in certain circumstances"
      ],
      helpful_links: [
        { title: "Texas Property Code Chapter 209", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.209.htm" },
        { title: "Texas HOA Laws", url: "https://www.texasattorneygeneral.gov/" },
        { title: "TREC HOA Information", url: "https://www.trec.texas.gov/" }
      ],
      last_updated: new Date().toISOString()
    }
  ],
  FL: [
    {
      id: "FL-tenant",
      state_code: "FL",
      state_name: "Florida",
      category: "landlord_tenant",
      title: "Florida Tenant Rights Overview",
      official_summary: "Florida Statutes Chapter 83 (Florida Residential Landlord and Tenant Act) establishes landlord and tenant rights regarding security deposits, eviction procedures, maintenance obligations, and lease requirements.",
      plain_language: "Florida tenants have specific protections under state law. Your landlord must return your security deposit within 15-60 days depending on whether there are deductions. You have the right to a habitable home, and there are specific procedures landlords must follow for evictions.",
      key_points: [
        "Security deposits must be returned within 15 days (no deductions) or 30 days (with deductions)",
        "Landlords must maintain the property in compliance with building codes",
        "Seven-day notice required for non-payment of rent evictions",
        "Tenants may withhold rent for serious habitability issues after proper notice",
        "No statewide rent control in Florida"
      ],
      helpful_links: [
        { title: "Florida Landlord Tenant Law", url: "http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0083/0083ContentsIndex.html" },
        { title: "Florida Attorney General Consumer Protection", url: "http://myfloridalegal.com/pages.nsf/Main/DC0B20B7DC22B7418525791B006A54E4" },
        { title: "Florida Bar Tenant Rights", url: "https://www.floridabar.org/public/consumer/tip014/" }
      ],
      last_updated: new Date().toISOString()
    },
    {
      id: "FL-consumer",
      state_code: "FL",
      state_name: "Florida",
      category: "consumer_protection",
      title: "Florida Consumer Protection Overview",
      official_summary: "Florida's Deceptive and Unfair Trade Practices Act (FDUTPA) prohibits unfair methods of competition and deceptive acts. The Florida Lemon Law provides protections for new vehicle purchasers.",
      plain_language: "Florida protects consumers against fraud and deception through FDUTPA. If you bought a defective new car, the Lemon Law may help you get a replacement or refund. You can file complaints with the Attorney General and may sue businesses that deceive you.",
      key_points: [
        "FDUTPA prohibits deceptive and unfair trade practices",
        "Florida Lemon Law covers new vehicles with substantial defects",
        "Consumers can recover actual damages and attorney fees",
        "Three-day right to cancel applies to certain door-to-door sales",
        "The Attorney General investigates consumer complaints"
      ],
      helpful_links: [
        { title: "Florida Attorney General Consumer Protection", url: "http://myfloridalegal.com/consumer" },
        { title: "Florida Lemon Law", url: "http://www.myfloridalegal.com/pages.nsf/Main/10C8F09D6C8F95B485256CC9004B8F65" },
        { title: "File a Complaint", url: "http://myfloridalegal.com/Contact.nsf/Contact?OpenForm&Section=Consumer_Protection_702" }
      ],
      last_updated: new Date().toISOString()
    },
    {
      id: "FL-hoa",
      state_code: "FL",
      state_name: "Florida",
      category: "hoa_rights",
      title: "Florida HOA Rights Overview",
      official_summary: "Florida Statutes Chapters 718 (Condominiums) and 720 (HOAs) extensively regulate community associations, requiring financial reporting, open meetings, access to records, and specific election procedures.",
      plain_language: "Florida has detailed laws governing HOAs and condos. You have the right to attend meetings, access financial records, and vote in elections. The association must follow specific procedures for fines and must maintain proper financial records.",
      key_points: [
        "Board meetings must be open to members with proper notice",
        "Members can inspect official records within 10 business days",
        "Annual financial reports are required for larger associations",
        "14-day notice and opportunity to be heard required before fines",
        "Recall procedures allow members to remove board members"
      ],
      helpful_links: [
        { title: "Florida HOA Laws (Chapter 720)", url: "http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0720/0720ContentsIndex.html" },
        { title: "Florida Condo Laws (Chapter 718)", url: "http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0718/0718ContentsIndex.html" },
        { title: "DBPR Division of Condos", url: "http://www.myfloridalicense.com/DBPR/condominiums-cooperatives-and-mobile-homes/" }
      ],
      last_updated: new Date().toISOString()
    }
  ],
  NY: [
    {
      id: "NY-tenant",
      state_code: "NY",
      state_name: "New York",
      category: "landlord_tenant",
      title: "New York Tenant Rights Overview",
      official_summary: "New York Real Property Law and the Housing Stability and Tenant Protection Act of 2019 provide extensive tenant protections including rent stabilization in qualifying buildings, security deposit limits, and strict eviction procedures.",
      plain_language: "New York has strong tenant protections, especially in rent-stabilized apartments. Security deposits are limited to one month's rent. Landlords must follow strict procedures for evictions and cannot retaliate against tenants who exercise their rights.",
      key_points: [
        "Security deposits limited to one month's rent statewide",
        "Rent-stabilized tenants have renewal rights and limited rent increases",
        "14-day notice required before late fees can be charged",
        "Warranty of habitability requires landlords to maintain safe, livable conditions",
        "Retaliation against tenants is prohibited"
      ],
      helpful_links: [
        { title: "NY Homes and Community Renewal", url: "https://hcr.ny.gov/tenant" },
        { title: "NYC Tenant Rights", url: "https://www1.nyc.gov/site/hpd/services-and-information/tenants-rights-and-responsibilities.page" },
        { title: "NY Attorney General Tenant Rights", url: "https://ag.ny.gov/consumer-frauds/housing-issues" }
      ],
      last_updated: new Date().toISOString()
    },
    {
      id: "NY-consumer",
      state_code: "NY",
      state_name: "New York",
      category: "consumer_protection",
      title: "New York Consumer Protection Overview",
      official_summary: "New York General Business Law Article 22-A prohibits deceptive acts and practices. The state has strong lemon laws for both new and used vehicles, and extensive consumer protection enforcement through the Attorney General.",
      plain_language: "New York actively protects consumers from fraud and deception. Both new and used car buyers have lemon law protections. The Attorney General investigates complaints and can take action against businesses that cheat consumers.",
      key_points: [
        "New Car Lemon Law covers defects within 2 years or 18,000 miles",
        "Used Car Lemon Law applies to vehicles under 100,000 miles",
        "Deceptive practices are prohibited under GBL 349",
        "Consumers can sue and recover attorney fees",
        "The AG Consumer Helpline assists with complaints"
      ],
      helpful_links: [
        { title: "NY Attorney General Consumer Protection", url: "https://ag.ny.gov/consumer-frauds-bureau" },
        { title: "NY Lemon Law", url: "https://ag.ny.gov/consumer-frauds/new-car-lemon-law" },
        { title: "File a Consumer Complaint", url: "https://ag.ny.gov/consumer-frauds/Filing-a-Consumer-Complaint" }
      ],
      last_updated: new Date().toISOString()
    },
    {
      id: "NY-hoa",
      state_code: "NY",
      state_name: "New York",
      category: "hoa_rights",
      title: "New York HOA Rights Overview",
      official_summary: "New York condominiums and cooperatives are governed by the Condominium Act and cooperative corporation law. The Attorney General oversees offering plans, and owners have specific rights regarding meetings and access to records.",
      plain_language: "If you own a condo or co-op in New York, you have rights to attend meetings and access financial information. The processes differ between condos and co-ops, but both require transparency and proper procedures.",
      key_points: [
        "Annual meetings are required for condo and co-op boards",
        "Owners can access meeting minutes and financial statements",
        "Co-op boards have significant discretion in approving sales",
        "Offering plans filed with AG provide disclosure of terms",
        "Disputes may be resolved through the AG or courts"
      ],
      helpful_links: [
        { title: "NY Attorney General Real Estate", url: "https://ag.ny.gov/bureau/real-estate-finance-bureau" },
        { title: "NYC HPD", url: "https://www1.nyc.gov/site/hpd/about/about-hpd.page" },
        { title: "NY Condo/Co-op Information", url: "https://ag.ny.gov/sites/default/files/homeowner_protection_program.pdf" }
      ],
      last_updated: new Date().toISOString()
    }
  ]
}

// US State list for generating defaults
const US_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
]

// Generate complete state rights data
export const stateRightsData: StateRightsData = US_STATES.reduce((acc, state) => {
  // Use state-specific data if available, otherwise use generated defaults
  acc[state.code] = stateSpecificData[state.code] || generateStateRights(state.code, state.name)
  return acc
}, {} as StateRightsData)

export function getStateRights(stateCode: string): StateRightsCategory[] {
  return stateRightsData[stateCode] || []
}

export function getStateName(stateCode: string): string {
  const state = US_STATES.find(s => s.code === stateCode)
  return state?.name || stateCode
}
