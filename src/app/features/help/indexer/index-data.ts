type HelpIndexData = {
  id: string,
  title: string,
  text: string,
};

export const HELP_INDEX_DATA: HelpIndexData[] = [
  {
    id: 'glos_aashto',
    title: 'AASHTO',
    text: 'aashto american association state highway transportation officials governing body writes publishes d' +
          'esign codes highway bridges united states'
  },
  {
    id: 'hlp_aashto_h20x44',
    title: 'AASHTO H25 truck loading',
    text: 'aashto h25 loading hypothetical cargo truck similar one pictured truck two axles spaced approximatel' +
          'y 4 meters apart truck total weight 225 kilonewtons kn 44 kn applied front axle 181 kn rear aashto t' +
          'ruck loading used design bridge axle weights generally increased factor called dynamic load allowanc' +
          'e accounts effects moving load structural engineer designs actual bridge must ensure members structu' +
          're safely carry forces generated one aashto truck loading applied every traffic lane bridge deck tru' +
          'ck loading positioned anywhere along length bridge indicated design specifications bridge designer a' +
          'llows design bridge either two highway loading conditions two lanes highway traffic represented one ' +
          'h25 truck lane single 480 kn permit loading centered laterally roadway first load case two traffic l' +
          'anes two main trusses must carry weight one lane thus loading used bridge designer consists one h25 ' +
          'truck total weight 225 kn second case single truck centered roadway two main trusses must carry one ' +
          'half total truck weight thus permit loading used bridge designer consists 240 kn 120 kn applied axle' +
          ' location cases dynamic load allowance 1.33'
  },
  {
    id: 'hlp_browser',
    title: 'About your browser...',
    text: 'best make bridge designer work computing devices mouse similar gadget plus broad range date browser ' +
          'software work phones sorry dont support pure touch devices like smart phones pads mouse browsers dat' +
          'e versions fine based recent chromium google chrome microsoft edge chromium open source opera firefo' +
          'x chromium firefox based browsers may work fine unfortunately cant support apple safari screen resol' +
          'ution least 1200 800 pixels better mouse accurate mouse like pointing device example track pad track' +
          ' ball fine fix problems switch browsers upgrade startup warning complained unsupported browser missi' +
          'ng html css features try installing current version one supported browsers device unable try latest ' +
          'possible version google chrome thats best chance success adjust settings hardware needed startup war' +
          'ning included screen resolution mouse youll need adjust replace hardware pro tips screen resolution ' +
          'usually choice check operating systems display settings screen resolutions around minimum set browse' +
          'r full screen mode use possible pixels many devices support adding mouse often dollars check web tak' +
          'e chances bridge designer might okay current browser despite warnings though features likely disable' +
          'd work poorly youll notified disabled features. give try clicking cancel warning dialog'
  },
  {
    id: 'glos_abutment',
    title: 'Abutment',
    text: 'abutment stone concrete wall supports one end bridge span abutment also acts retaining wall holding ' +
          'back earth embankments approaches bridge abutment part substructure bridge'
  },
  {
    id: 'hlp_animation_controls',
    title: 'Animation controls',
    text: 'column seven faded icons displayed top animation image light mouse gets close walk click icon drag w' +
          'alk animation pan click icon drag shift horizontally vertically without going forward back head turn' +
          ' click icon drag turn head standing still home click move back starting view whole bridge truck view' +
          ' click icon see truck driver traverses bridge drag turn head click walk pan head turn home quit truc' +
          'k view pause/play click pause unpause animation test failed click see failure settings click show hi' +
          'de settings dialog selecting animation settings view menu dont touch navigation controls truck makes' +
          ' two complete passes seconds bridge fails view automatically start orbit meters terrain touching nav' +
          'igation control cancels orbit puts back control retest bridge orbit'
  },
  {
    id: 'hlp_animation_settings',
    title: 'Animation settings',
    text: 'dialog provides options modify animations appearance move around animation play/pause see animation ' +
          'controls shadows controls whether sun casts shadows within simulated scene sky controls whether sky ' +
          'drawn clouds sun hills horizon simple blue background terrain controls whether ground water around b' +
          'ridge drawn wind turbine controls whether wind generator close bridge drawn abutments controls wheth' +
          'er bridge abutments road surfaces drawn truck controls whether cartoon truck loading shown hidden co' +
          'lors controls whether member forces depicted colors box checked compression represented red tension ' +
          'blue load moves across bridge deck color brightness corresponds intense loading load indicated flat ' +
          'gray exaggeration controls whether member deflections exaggerated make visible unchecked animation r' +
          'ealistic checked changes shape truss load multiplied 20 order make visible move speed slider change ' +
          'speed truck move brightness slider account differences displays making whole image darker brighter n' +
          'otes tips smoothness animation depends speed computers processor graphics system motion looks jerky ' +
          'try turning animation features shadows likely greatest effect slowing truck speed makes easier see m' +
          'embers take release load test proceeds turning colors exaggeration provides realistic view bridge jo' +
          'b'
  },
  {
    id: 'glos_arch_abutments',
    title: 'Arch abutments',
    text: 'bridge designer arch abutments substructure elements use arch supports hold bridge transmit weight s' +
          'oil'
  },
  {
    id: 'glos_arch_supports',
    title: 'Arch supports',
    text: 'arch supports consist pin end span arch supports allow lateral movement bridge thus provide restrain' +
          't simple supports'
  },
  {
    id: 'glos_asphalt',
    title: 'Asphalt',
    text: 'asphalt mixture gravel bitumen product petroleum refining process asphalt commonly used pavement wea' +
          'ring surface bridge decks'
  },
  {
    id: 'hlp_3dprint_assembly',
    title: 'Assembling your bridge model',
    text: 'instructions assume youve already printed parts model using instructions exporting obj files prepare' +
          ' build things youll need assemble printed parts flat clean work surface protected glue spills paper ' +
          'shelf paper large paper bag flattened work cyanoacrylate glue crazy glue another plastic glue bond p' +
          'arts xacto knife box cutter single edge razor blade trim parts needed fine sand paper 150 220 grit n' +
          'ail file tool expand holes diameter equal minimum feature size slightly larger theyre small fit corr' +
          'esponding pins tapered xacto blade work micro drill bit pin vice tool spin bit ideal careful begin l' +
          'aying parts type good way avoid confusion draw grid nine boxes three inches square build surface cov' +
          'ering paper label 1 9 sort parts ref name qty 1 support cross member 2 5 2 deck end panel 2 3 deck m' +
          'id panel varies 4 pin cross member varies 5 join deck beam 1 7 truss 2 8 abutment 2 9 pier 0 1 impor' +
          'tant notes tell difference deck end mid panels looking tabs slots fit together mid panel end panels ' +
          'tabs abutments look bit different picture one associated anchorage case extra step tab support cross' +
          ' member pillow used connect anchored members build steps complete model step use trimming tool and/o' +
          'r hole drill make joint fit well gaps excessive tightness applying glue may take time patient glue t' +
          'wo support cross members 1 slots two deck end panels 2 set aside grid square 2 dry bridge pier deck ' +
          'height glue another support cross member 1 deck mid panel 3 otherwise go next step set aside grid sq' +
          'uare 3 dry glue pin cross member 4 deck join beam 5 glue remaining pin cross members 4 remaining dec' +
          'k mid panels 3 numbers match glue deck join beam 5 onto one deck end panels 2 return assembly square' +
          ' 5 dry take break wait glue applied far solid dry fit whole deck arranging deck panels 2 3 4 5 top s' +
          'ide shown diagram glue end panels go end deck level pier panel one must also right position use tool' +
          's ensure panels fit together completely test pair panels make sure joint pins farther apart deck joi' +
          'nts truss wont able attach remove material panel tabs sandpaper file keep panels dry fit left right ' +
          'order avoid confusion assembling deck tune cross member pins truss holes needed pin fits hole should' +
          'er shown. tuning means using cutter sandpaper nail file hole drill needle needed make pin hole sizes' +
          ' match identify insides trusses smooth flat assembled inside surfaces point toward deck opposite sid' +
          'es thickened gusset joint. >outside truss point away deck attach two leftmost deck joints trusses 7 ' +
          'four pins deck join beam assembly 5 . make sure inside truss points toward deck take break wait deck' +
          ' join beam connections trusses solid add deck panels one time working right deck join beam assembly ' +
          'gluing go sure keep panels correct order dry fitted take break let deck panels dry completely add re' +
          'st pin cross members 4 truss joints make sure skip support joints abutments pier anchorages well get' +
          ' later glue support cross member 1 pillows triangular sections abutment 8 tab fits slot bridge ancho' +
          'rages theres second tab second support cross member glue pillow finally bridge pier glue last pillow' +
          ' tab attach truss abutments fit abutment pins corresponding truss pin holes includes anchorage pins ' +
          'bridge glue yet make sure abutments sitting flat surface add drop glue joint take break make sure br' +
          'ide attachment abutments solid attache glue piers pins truss one make sure abutments pier sitting fl' +
          'at surface glue sets youre done notes tips consider printing blueprint bridge assembly instructions ' +
          'paper truss configuration ready reference steps ticking go strangely satisfying bridge parts particu' +
          'larly big spans anchorages tiny youre feeling crafty try printing truss two pieces obtain bridge twi' +
          'ce scale one print would allow need cut truss half slicer software print half separately glue togeth' +
          'er first step assembly assembling bridge model challenging methodical work steadily something goes w' +
          'rong reprint parts need try good luck project'
  },
  {
    id: 'glos_astm',
    title: 'ASTM',
    text: 'american society testing materials astm profit organization manufacturers consumers researchers gove' +
          'rnment officials purpose write standards production testing use building materials astm standards en' +
          'sure materials uniformly understood engineering properties appropriate level quality'
  },
  {
    id: 'hlp_auto_correct_errors',
    title: 'Auto-correct errors check box',
    text: 'checking menu entry tools auto correct errors causes bridge designer attempt repairs common minor er' +
          'rors automatically load test notes tips usually best enable auto correction feature cant harm undesi' +
          'red changes makes removed undo analysis complete'
  },
  {
    id: 'glos_bearing',
    title: 'Bearing',
    text: 'bearing another word support supports joints structure attached foundation'
  },
  {
    id: 'glos_bridge_design_file',
    title: 'Bridge design file',
    text: 'bridge design file specially formatted text file created bridge designer save bridge design future u' +
          'se'
  },
  {
    id: 'hlp_bridge_design_window',
    title: 'Bridge design window',
    text: 'bridge design window graphical environment create test optimize record bridge design diagram shows m' +
          'ajor functional components make bridge design window learn component click corresponding area diagra' +
          'm notes tips best keep bridge design window maximized working design reducing window size makes draw' +
          'ing editing structural model difficult'
  },
  {
    id: 'glos_buckling',
    title: 'Buckling',
    text: 'buckling principal failure mode member loaded compression member buckles bends sideways compressed a' +
          'xially failure usually sudden catastrophic members long slender particularly susceptible buckling'
  },
  {
    id: 'glos_cable_anchorages',
    title: 'Cable anchorages',
    text: 'cable anchorage foundation structure cables suspension bridge connected cables support weight suspen' +
          'sion bridge anchorages massive often extend far surface earth bridge designer cable anchorages repre' +
          'sented pinned supports'
  },
  {
    id: 'hlp_change_member_properties',
    title: 'Change the properties of a member',
    text: 'change properties member structural model click select tool design tools palette select member want ' +
          'modify either clicking member clicking entry member list member turn light blue selected click drop ' +
          'button member properties list property want change material cross section member size select materia' +
          'l cross section member size respective list new property assigned selected member notes tips change ' +
          'properties several members simultaneously use multiple selection choose new material cross section m' +
          'ember size appropriate member properties list increase decrease size selected members next larger sm' +
          'aller one select members want modify click increase member size button decrease member size button u' +
          'se multiple selection either button selected members wont necessarily end size. theyll increase decr' +
          'ease independently want change properties members structural model click select button choose new ma' +
          'terial cross section member size change properties member appearance member change drawing board cha' +
          'nging material cause color displayed member change changing size cause width member change according' +
          'ly changing cross section solid bar hollow tube cause displayed member change single line double lin' +
          'e vice versa'
  },
  {
    id: 'hlp_choose_optimum',
    title: 'Choose the optimum design',
    text: 'design bridge go back one step go forward one step bridge designer optimum design one costs least co' +
          'nsidered many different alternative site truss configurations possible choose one lowest total cost ' +
          'final design notes tips design actual bridge many criteria would taken account selecting desirable a' +
          'lternative include aesthetics ease construction ease maintenance local availability materials enviro' +
          'nmental impact'
  },
  {
    id: 'glos_chords',
    title: 'Chords',
    text: 'chords main horizontal load carrying members truss truss bridge top chords normally carry compressio' +
          'n bottom chords normally carry tension'
  },
  {
    id: 'glos_client',
    title: 'Client',
    text: 'client person organization hires professional like engineer doctor lawyer perform specialized servic' +
          'e'
  },
  {
    id: 'hlp_component_parts',
    title: 'Component parts of a truss bridge',
    text: 'major component parts typical truss bridge chords top bottom verticals also called vertical members ' +
          'diagonals also called diagonal members floor beams deck pinned support also called fixed bearing rol' +
          'ler support also called expansion bearing abutments piers component parts illustrated 3 dimensional ' +
          'view elevation side view notes tips number standard truss configurations commonly used bridge struct' +
          'ures defined primarily geometry vertical diagonal members'
  },
  {
    id: 'glos_compression',
    title: 'Compression',
    text: 'compression internal axial member force tends >>>shorten<<< member'
  },
  {
    id: 'hlp_compressive_strength',
    title: 'Compressive strength',
    text: 'compressive strength member internal force causes become unsafe compression actual member force exce' +
          'eds compressive strength member might fail compressive strength calculations performed bridge design' +
          'er based buckling failure mode compressive strength represented symbol ϕp n measured units force kil' +
          'onewtons abbreviated kn compressive strength calculated using following equations λ ≤ 2.25 ϕp n = ϕ ' +
          '0.66 λ f y λ > 2.25 ϕp n = ϕ 0.88 f y ⁄ λ λ = f y al 2 ⁄ π 2 ei dimensionless parameter differentiat' +
          'es inelastic λ ≤ 2.25 elastic λ > 2.25 buckling failure modes ϕ = 0.90 resistance factor member comp' +
          'ression f y yield stress cross sectional area member π 3.14159.. e modulus elasticity material momen' +
          't inertia member l length member notes tips equations taken 1994 aashto lrfd bridge design specifica' +
          'tions see graph compressive strength function member length see member analysis report menu testing ' +
          'bridge obtain numerical values f y e given material given cross section member size first test bridg' +
          'e select member analysis report menu use toolbar button bridge designer calculates compressive stren' +
          'gth member structural model load test compressive strength member always less tensile strength membe' +
          'r relatively long slender difference quite substantial number 0.88 equation accounts fact actual str' +
          'uctural members never perfectly straight slight crookedness actual structural members buckle interna' +
          'l force average 12% lower theory predicts'
  },
  {
    id: 'glos_concrete',
    title: 'Concrete',
    text: 'concrete mixture portland cement sand gravel water perhaps special additives concrete hardens forms ' +
          'solid rock like substance used build many kinds structures'
  },
  {
    id: 'glos_connections',
    title: 'Connections',
    text: 'connection assembly steel plates bolts and/or welds attach two members together structure connection' +
          's real structure represented joints bridge designer structural models'
  },
  {
    id: 'hlp_context_widgets',
    title: 'Context widgets',
    text: 'drawing board provides controls called context widgets speed work theyre invoked right clicking mous' +
          'e location right click determines controls appear right click selected member shows dialog controls ' +
          'support editing selected members member properties lists increase member size button decrease member' +
          ' size button delete selection button view/hide member list button right click anywhere else shows me' +
          'nu controls common editing needs design tools selector select button view/hide member list button gr' +
          'id resolution buttons'
  },
  {
    id: 'hlp_cost',
    title: 'Cost of the design',
    text: 'bridge designer automatically calculates cost bridge design create cost continuously updated display' +
          'ed status toolbar cost calculated bridge designer accurately represent total cost actual bridge proj' +
          'ect rather intended give general appreciation competing factors influence cost typical engineering p' +
          'roject learning tool total cost bridge design consists two major components site cost truss cost sit' +
          'e cost turn sum three components excavation cost deck cost support cost truss cost also includes thr' +
          'ee components material cost connection cost product cost cost components described specific numerica' +
          'l cost factors listed design specifications site cost site cost consists costs associated selection ' +
          'site configuration deck height span length support configuration bridge excavation cost select deck ' +
          'height determine amount soil must excavated achieve correct highway elevation lower deck excavation ' +
          'required real world construction excavation priced cubic yard cubic meter bridge designer determines' +
          ' required volume soil excavation based selected deck elevation deck cost selection deck height also ' +
          'determines overall span length bridge higher deck results longer span increases truss cost cost rein' +
          'forced concrete deck bridge designer also select material deck made either medium strength high stre' +
          'ngth concrete medium strength concrete costs less high strength concrete lower strength requires dec' +
          'k thicker thicker deck weighs thinner high strength concrete deck thus increase loading truss increa' +
          'sed loading cause truss cost increase result cheaper deck tends require expensive truss vice versa e' +
          'ither case cost deck specified lump sum cost 4 meter deck panel support cost select type abutments p' +
          'iers cable anchorages used bridge bridge designer determines costs associated constructing supports ' +
          'support configuration unique cost given type abutment standard arch cost tends increase span length ' +
          'longer spans weigh shorter spans thus transmit greater loads supports general standard abutments cos' +
          't less arch abutments given span length costs arch abutments piers also vary significantly height hi' +
          'gher abutments piers use material shorter ones cost cable anchorages single lump sum cost truss cost' +
          ' truss cost consists costs associated structural steel members connections make two main trusses pri' +
          'ncipal load carrying elements bridge material cost structural steel normally priced weight mass e.g.' +
          ' dollars per pound dollars per kilogram thus cost structure depends part total weight material used ' +
          'build bridge designer calculates material cost determining total mass three available materials carb' +
          'on steel high strength steel quenched tempered steel structural model multiplying mass material type' +
          ' corresponding unit cost dollars per kilogram adding together get total material cost noted design s' +
          'pecifications three different types steel different unit cost carbon steel least expensive quenched ' +
          'tempered steel expensive given material hollow tubes expensive per kilogram solid bars connection co' +
          'st real structures cost fabricating building connections join members together significant thus brid' +
          'ge designer includes cost per joint part total cost structure actual three dimensional bridge two ma' +
          'in trusses number connections used basis calculation double number joints two dimensional structural' +
          ' model product cost structural design construction economical design often one simply minimizes mate' +
          'rial cost often total cost structure reduced standardizing materials member sizes members structure ' +
          'different materials sizes cost ordering fabricating constructing members relatively high many member' +
          's fabrication construction costs relatively lower reason bridge designer includes cost per product p' +
          'art total cost truss product defined unique combination material cross section member size structura' +
          'l model cost calculations see cost factors cost per kilogram cost per joint cost per product site co' +
          'st actual cost calculations current design click report cost calculations button site design wizard ' +
          'also displays detailed calculations component site cost minimizing total cost attempt minimize total' +
          ' cost bridge design find never minimize site cost material cost connection cost product cost simulta' +
          'neously minimizing total cost always compromise among four competing factors minimize site cost woul' +
          'd simply select site configuration costs least least expensive site configuration requires simply su' +
          'pported truss spanning full 44 meters configuration require relatively heavy truss one high material' +
          ' cost minimize material cost must make member light possibly without failing truss configurations ac' +
          'hieving condition requires use solid bars hollow tubes wide variety different sizes minimizing mater' +
          'ial cost requires use lot different products result product cost quite high minimize connection cost' +
          ' must use smallest possible number joints minimize number joints inevitably long members structural ' +
          'model long member subjected compressive loading require large member size keep failing member gets l' +
          'onger compressive strength decreases significantly. thus minimizing connection cost usually results ' +
          'high material cost minimize product cost would need use single material cross section size every mem' +
          'ber structural model single member size would large enough ensure heavily loaded member structure fa' +
          'il result many members would much stronger therefore much heavier really need material cost would ex' +
          'tremely high clearly tradeoffs among site cost material cost connection cost product cost minimizing' +
          ' one always increases one others task designer find best compromise'
  },
  {
    id: 'hlp_crossxsection',
    title: 'Cross-section',
    text: 'cross section shape formed cutting member perpendicular axis cross section solid bar square measurin' +
          'g w side cross section hollow tube open square measuring w side wall thickness cross sectional area ' +
          'member surface area cross section picture light blue shaded region'
  },
  {
    id: 'glos_cut',
    title: 'Cut',
    text: 'cut excavation lowers elevation roadway existing surface land'
  },
  {
    id: 'hlp_truss_configuration',
    title: 'Decide on a truss configuration',
    text: 'design bridge go back one step go forward one step youve selected site configuration must decide ove' +
          'rall configuration bridge bridge designer allows truss configuration long stable notes tips developi' +
          'ng stable structural model tricky recommend new inexperienced users start standard truss configurati' +
          'on decide use standard truss configuration load display template help correctly draw joints members'
  },
  {
    id: 'glos_deck',
    title: 'Deck',
    text: 'deck floor bridge directly supports vehicles pedestrians crossing bridge bridge decks usually made r' +
          'einforced concrete'
  },
  {
    id: 'hlp_deck_truss',
    title: 'Deck truss',
    text: 'deck truss one deck located level top chord. vehicles crossing deck truss bridge supported trusses'
  },
  {
    id: 'glos_deck_truss',
    title: 'Deck truss',
    text: 'deck truss deck located top chord vehicles supported trusses cross bridge'
  },
  {
    id: 'hlp_decrease_member',
    title: 'Decrease member size button',
    text: 'click decrease member size button decrease size currently selected member next smaller notes tips de' +
          'crease member size button located member properties toolbar one member selected clicking button decr' +
          'ease size selected members even different sizes example 50mm member 90mm member 120mm member selecte' +
          'd clicking button change 45mm 80mm 110mm respectively use decrease member size button member size li' +
          'st updated reflect change use decrease member size button two member properties lists material cross' +
          ' section type change'
  },
  {
    id: 'hlp_delete_joint',
    title: 'Delete a joint',
    text: 'delete joint structural model click select tool design tools palette click joint want delete turn li' +
          'ght blue indicate selected click delete button notes tips must working drawing board delete joint de' +
          'lete key keyboard performs function delete button toolbar delete one joint time multiple selection j' +
          'oints allowed delete joint members attached joint also deleted cannot delete joints created automati' +
          'cally bridge designer started design also delete joint structural model erasing accidentally delete ' +
          'joint click undo button restore'
  },
  {
    id: 'hlp_delete_member',
    title: 'Delete a member',
    text: 'delete member structural model click select tool design tools palette select member want delete eith' +
          'er clicking member clicking entry member list member turn light blue indicate selected click delete ' +
          'button delete selected member notes tips must drawing board mode delete member want delete one membe' +
          'r time use multiple selection click delete button delete key keyboard performs function delete butto' +
          'n toolbar delete member members higher member numbers re numbered fill gap also remove member struct' +
          'ural model erasing accidentally delete member click undo button restore'
  },
  {
    id: 'hlp_delete',
    title: 'Delete button',
    text: 'click delete button delete currently selected joint delete currently selected member notes tips dele' +
          'te button located main toolbar also available edit menu use delete key keyboard perform exactly func' +
          'tion delete button also use eraser tool delete joints members'
  },
  {
    id: 'hlp_design_specifications',
    title: 'Design specifications',
    text: 'specifications listed built bridge designer follow design process bridge designer ensure satisfy spe' +
          'cifications listed better understand sorts requirements constraints engineers consider design real b' +
          'ridges problem youre civil engineer working state department transportation assigned responsibility ' +
          'design truss bridge carry two lane highway across river valley shown design objective satisfy specif' +
          'ications listed keeping total cost project low possible bridge configuration bridge may cross valley' +
          ' elevation high water level 24 meters high water level elevation bridge deck 24 meters excavation ri' +
          'ver banks required achieve correct highway elevation amount excavation required deck elevation deter' +
          'mined automatically bridge designer provide clearance overhead power lines shown highest point bridg' +
          'e may exceed elevation 32.5 meters high water level 8.5 meters top river banks bridge substructure m' +
          'ay consist either standard abutments simple supports arch abutments arch supports necessary bridge m' +
          'ay also use one intermediate pier located near center valley necessary bridge may also use cable anc' +
          'horages located 8 meters behind one abutments main truss 100 joints 200 members bridge flat reinforc' +
          'ed concrete deck two types concrete available medium strength concrete requires deck thickness 23 ce' +
          'ntimeters 0.23 meter high strength concrete requires deck thickness 15 centimeters 0.15 meter either' +
          ' case deck supported transverse floor beams spaced 4 meter intervals see component parts truss bridg' +
          'e information terms. accommodate floor beams structural model must row deck support joints spaced 4 ' +
          'meters apart deck level joints created automatically begin new design bridge deck 10 meters wide all' +
          'owing accommodate two lanes traffic member properties materials member truss made carbon steel high ' +
          'strength low alloy steel quenched tempered steel cross sections members truss either solid bars holl' +
          'ow tubes types cross sections square member size cross sections available variety standard sizes loa' +
          'ds bridge must capable safely carrying following loads weight reinforced concrete deck weight 5 cm t' +
          'hick asphalt wearing surface might applied time future weight steel floor beams supplemental bracing' +
          ' members apply 12.0 kn load deck support joint weight main trusses weight either two possible truck ' +
          'loadings one standard h25 truck loading per lane including appropriate allowance dynamic effects mov' +
          'ing load since bridge carries two lanes traffic main truss must safely carry one h25 vehicle placed ' +
          'anywhere along length deck. single 480 kn permit loading including allowance dynamic effects moving ' +
          'load since permit loading assumed centered laterally main truss must safely carry one half total veh' +
          'icle weight placed anywhere along length deck structural safety bridge comply structural safety prov' +
          'isions 1994 lrfd aashto bridge design specification lrfd refers load resistance factor design. inclu' +
          'des material densities load combinations tensile strength members compressive strength members cost ' +
          'cost design calculated using following factors material cost carbon steel bars $4.50 per kilogram ca' +
          'rbon steel tubes $6.30 per kilogram high strength steel bars $5.00 per kilogram high strength steel ' +
          'tubes $7.00 per kilogram quenched tempered steel bars $5.55 per kilogram quenched tempered steel tub' +
          'es $7.75 per kilogram connection cost $500.00 per joint product cost $1000.00 per product site cost ' +
          'reinforced concrete deck medium strength $5 150 per 4 meter panel reinforced concrete deck high stre' +
          'ngth $5 300 per 4 meter panel excavation $1.00 per cubic meter see site design wizard excavation vol' +
          'ume supports abutments pier cost varies see site design wizard specific values cable anchorages $6 0' +
          '00 per anchorage notes tips bridge designer ensures design satisfies design specifications listed dr' +
          'awing board automatically set bridge correct span length height supports bridge designer automatical' +
          'ly calculates loads resulting member forces run load test performs aashto structural safety checks m' +
          'embers structural model strong enough tells ones need strengthened also calculates cost design aasht' +
          'o safety standards simplified considerably bridge designer thats one important reason software educa' +
          'tional use information see realistic bd'
  },
  {
    id: 'hlp_design_tools',
    title: 'Design tools palette',
    text: 'design tools palette free floating toolbar positioned anywhere bridge design window contains followi' +
          'ng tools creating modifying structural model joint tool member tool select tool eraser tool notes ti' +
          'ps move design tools palette new location click drag title bar palette'
  },
  {
    id: 'glos_diagonals',
    title: 'Diagonals',
    text: 'diagonals truss members oriented diagonally usually connect top bottom chords'
  },
  {
    id: 'glos_displacement',
    title: 'Displacement',
    text: 'displacement movement joint occurs loads applied structure'
  },
  {
    id: 'hlp_draw_joint',
    title: 'Draw joints',
    text: 'design bridge go back one step go forward one step create structural model must first draw joints co' +
          'nnections structural members joined together draw joint select joint tool design tools palette posit' +
          'ion mouse pointer location drawing board want add joint click left mouse button create new joint not' +
          'es tips draw joint must drawing board mode joints placed snap points drawing board joints cannot pla' +
          'ced outside maximum minimum elevation restrictions noted design specifications two joints cannot pla' +
          'ced location accidentally place joint wrong location click undo button remove also delete joint move' +
          ' joint new location start new design series joints created automatically project setup wizard joints' +
          ' support deck cant moved deleted movable joints black outline light grey center immovable joints gre' +
          'y outline white center joints create cannot attached abutments piers words cant create additional su' +
          'pports supports permitted created automatically project setup wizard site configurations high pier j' +
          'oints cannot drawn pier structural model limited 50 joints'
  },
  {
    id: 'hlp_draw_member',
    title: 'Draw members',
    text: 'design bridge go back one step go forward one step drawn joints connect truss draw members make stru' +
          'cture members must drawn joint joint draw member select member tool design tools palette position mo' +
          'use pointer joint highlighted show ready connected click left mouse button hold drag mouse pointer a' +
          'nother joint release button new member created first joint second notes tips draw member must drawin' +
          'g board mode create new member member properties currently displayed member properties lists automat' +
          'ically assigned new member changed later see change properties member information create new members' +
          ' member numbers assigned automatically display member numbers click view member numbers button two m' +
          'embers cannot drawn pair joints attempt draw member crosses one joints ends two members automaticall' +
          'y created theyll properties accidentally draw member wrong location click undo button remove delete ' +
          'member site configurations high pier members cannot drawn intermediate pier structural model 120 mem' +
          'bers'
  },
  {
    id: 'hlp_drawing_board',
    title: 'Drawing board',
    text: 'drawing board portion bridge design window create structural model drawing joints members mouse usin' +
          'g drawing board also edit structural model moving adding deleting joints changing member properties ' +
          'adding deleting members notes tips use drawing board button return drawing board load test bridge ab' +
          'utments floor beams concrete deck asphalt road surface high water level displayed drawing board time' +
          's see component parts truss bridge information terms. size position based site configuration youve s' +
          'elected drawing board covered drawing grid cant see there. draw joints create structural model mouse' +
          ' snaps grid line intersections called snap points joints drawn snap points drawing grid set low medi' +
          'um high resolution use grid resolution buttons switch among three often easiest create structural mo' +
          'del using low resolution grid switch medium high resolution settings editing horizontal vertical rul' +
          'ers displayed left bottom edges drawing board help accurately position joints structural model symme' +
          'try guides displayed drawing board help position joints structural model symmetrical title block dis' +
          'played lower right hand corner drawing board title block shows name bridge design project name desig' +
          'ner project identification name number designer project names changed time start new design may chos' +
          'e display truss template drawing board help easily design stable structural model'
  },
  {
    id: 'hlp_drawing_board_button',
    title: 'Drawing board button',
    text: 'click drawing board button return drawing board mode load test notes tips drawing board button locat' +
          'ed main toolbar also available test menu drawing board button load test button work pair. one presse' +
          'd time'
  },
  {
    id: 'glos_drawing_grid',
    title: 'Drawing grid',
    text: 'drawing grid invisible set snap points drawing board lie intersections two sets parallel lines one h' +
          'orizontal one vertical lines spaced 0.25 0.5 1.0 meters apart depending current grid resolution join' +
          'ts located snap points grid locations indicated ticks vertical horizontal rulers located left bottom' +
          ' edges drawing board'
  },
  {
    id: 'glos_dynamic_load_allowance',
    title: 'Dynamic load allowance',
    text: 'dynamic load allowance factor used bridge design represent effect moving loads bridge designer uses ' +
          'dynamic load allowance 33% means moving truck causes 33% force bridge members stationary truck'
  },
  {
    id: 'hlp_erase',
    title: 'Erase a joint or member',
    text: 'erase joint member structural model click eraser tool design tools palette click joint member want e' +
          'rase notes tips must drawing board mode erase joint member erase one joint member time erase joint m' +
          'embers attached joint also erased cannot erase joints created automatically bridge designer started ' +
          'new design erase member members higher member numbers re numbered fill gap also delete joint delete ' +
          'member remove structural model accidentally erase joint member click undo button restore'
  },
  {
    id: 'hlp_erase_tool',
    title: 'Eraser tool',
    text: 'use eraser tool erase joint member directly without select first notes tips eraser tool located desi' +
          'gn tools palette also available tools menu eraser tool use mouse pointer appears pencil cross showin' +
          'g cursor location move eraser tool drawing board joints members highlighted indicate item erased lef' +
          't button click'
  },
  {
    id: 'hlp_export_to_3dprint',
    title: 'Export files to 3d print',
    text: 'use 3d print button file menu item export files obj format imported 3d printer slicer program printe' +
          'd result parts realistic scale model bridge suitable display dialog appear asking important paramete' +
          'rs smallest printable feature size model bridge members printed scale thin print minimum feature siz' +
          'e given millimeters used instead scale size cases one millimeter minimum larger values sacrifice sca' +
          'le appearance slightly make printing assembly easier wiggle room 3d printers place bit much material' +
          ' around small features like holes pegs used align model bridge parts value used adjust sizes good fi' +
          't every printer different trial error may needed find good value 0.20mm starting point parts fit tig' +
          'htly try larger wiggle room value vice versa scale establishes models overall size move slider try d' +
          'ifferent values. dialog show resulting maximum object dimensions make sure maximums fit within print' +
          'ers build volume base file name determines start obj file name containing bridge parts ready click o' +
          'k three files sent browsers downloads folder base_file_name trusses.obj base_file_name abutments.obj' +
          ' base_file_name cross members.obj base_file_name substituted name dialog file contains collection pi' +
          'eces placed theyre likely fit print volume however guaranteed may want arrange print batches differe' +
          'ntly use slicer software printer usual import obj files print parts item file separate object obj fi' +
          'le format slicer software let position individually delete ones dont fit single print necessary some' +
          'times splitting command required see separate objects prusa slicer example requires highlight import' +
          ' press button multi colored bridge e.g one color trusses another cross members third deck also organ' +
          'ize objects per intended color parts thin brims extra material added help printer bed adhesion must ' +
          'trimmed away prior use errors kinds bridges complex export often cause short members happens dialog ' +
          'display error notes tips bridge complex export try increasing scale far printer allows example use d' +
          'iagonal bed described cases allow export succeed biggest pieces model usually trusses goal make bigg' +
          'est possible model try printing trusses one time oriented diagonally printer bed minimum feature siz' +
          'e consider using multiple printers nozzle size thats least one millimeter. example nozzle 0.4mm try ' +
          '1.2 1.6 see tips assembling bridge model important details youve printed parts'
  },
  {
    id: 'hlp_find_opt_substructure',
    title: 'Find the optimum site configuration and load case',
    text: 'design bridge go back one step go forward one step point design process optimized design one particu' +
          'lar site configuration load case one particular combination deck height span length support configur' +
          'ation deck material truck loading. wont know design truly optimal considered site configurations loa' +
          'd cases bridge designer allows 98 possible site configurations consisting various combinations deck ' +
          'elevation support type support height also four possible load cases consisting various combinations ' +
          'deck material truck loading total cost bridge equals site cost plus truss cost site configuration su' +
          'pports bridge different way thus different site cost load case different effect steel truss thus lik' +
          'ely result different truss cost even though site cost makes major portion bridges total cost picking' +
          ' configuration lowest site cost necessarily result lowest total cost site configurations low site co' +
          'st tend relatively high truss costs vice versa site configuration high deck elevation generally rela' +
          'tively low site cost requires little excavation yet configuration high deck elevation also greater s' +
          'pan length longer spans require larger heavier trusses leads higher truss costs arch abutments cost ' +
          'standard abutments tall arch abutments cost short ones thus site configurations use arches tend high' +
          'er site cost v shape river valley allows arch abutments reduce span length given deck height taller ' +
          'abutment shorter span arch abutments also provide lateral restraint standard abutments factors tend ' +
          'lower truss cost arches building pier middle river quite expensive thus configurations piers signifi' +
          'cantly higher site costs without pier also divides one long span two short ones two short trusses us' +
          'ually much less expensive single long one cable anchorages also expensive provide additional support' +
          ' thus reduce truss cost significantly example cable supports cable stayed bridge choice deck materia' +
          'l affects site cost loads applied load test medium strength concrete less expensive high strength co' +
          'ncrete results thicker deck heavier high strength concrete expensive results thinner deck lighter th' +
          'us less expensive deck material tends result higher truss cost expensive deck material results lower' +
          ' truss cost choice truck loading effect site cost significant effect truss cost lesson learned engin' +
          'eering design always involves tradeoffs tradeoff cost structure cost supporting substructure critica' +
          'lly important aspect real world bridge designs site configuration load case result lowest total cost' +
          ' way answer question trial error combined careful logical reasoning find optimum substructure config' +
          'uration click new design button project setup wizard displayed select one site configurations load c' +
          'ases havent tried yet best change one variable time draw valid conclusions effect change example sup' +
          'pose first design single span standard abutments deck height 24 meters second design might try arch ' +
          'leave deck height 24 meters cost difference two trials directly attributed different support type ch' +
          'ange support type deck height simultaneously wont know factors affects cost repeat previous eight st' +
          'eps design process new site configuration load case decide truss configuration draw joints draw memb' +
          'ers load test design strengthen unsafe members optimize member properties optimize shape truss optim' +
          'ize truss configuration compare results two trials draw logical conclusion one variable changed seco' +
          'nd trial particular deck height standard abutments arch abutments result lower cost large difference' +
          ' two large might able draw general conclusion two support types two results close youll probably nee' +
          'd trials try another site configuration load case change one characteristic second trial 4 meter hig' +
          'h arch might use 12 meter 16 meter height next trial repeat entire design process optimize truss new' +
          ' site configuration compare results previous trials use comparison logical basis new exploration con' +
          'duct trials able eliminate uneconomical site configurations load cases youve eliminated one optimum'
  },
  {
    id: 'hlp_try_new_configuration',
    title: 'Find the optimum truss configuration',
    text: 'design bridge go back one step go forward one step design iterative process achieve optimal design p' +
          'robably need try many different truss configurations might guess millions possible configurations pr' +
          'obably wont time try find optimum without modeling testing every possible truss configuration one ap' +
          'proach consider alternative configurations systematic way select configuration optimize member prope' +
          'rties carefully observe changes configuration affected cost design keep track changes produce reduct' +
          'ions cost use observations guide selection next configuration find optimum truss configuration try d' +
          'ifferent deck location first design deck truss try corresponding truss vice versa try different stan' +
          'dard truss configuration example first design pratt truss try howe warren configuration try reducing' +
          ' lengths compression members truss compressive strength member function length member gets longer co' +
          'mpressive strength decreases substantially much less resistance buckling reason cost truss design so' +
          'metimes reduced shortening one compression members example lets start standard warren truss top chor' +
          'ds simple span truss bridge always compression might able reduce cost warren truss subdividing top c' +
          'hord members like consider standard pratt truss configuration top chords verticals normally compress' +
          'ion could subdivide top chords verticals like length compression member reduced half designer usuall' +
          'y able use much smaller member size achieve required compressive strength note also subdivide member' +
          ' always need add additional joints members maintain stability stable truss generally must made serie' +
          's interconnected triangles subdivide compression member bridge designer must normally delete compres' +
          'sion member want subdivide add new joint near midpoint member deleted add two new members replace or' +
          'iginal member add additional members ensure stability optimize member properties new members reducin' +
          'g length compression members may may reduce total cost design depending whether cost saving using sm' +
          'aller member sizes enough offset increased cost additional joints members try reducing number joints' +
          ' cost design includes fixed cost per joint thus may able reduce total cost reducing number joints st' +
          'ructural model example consider standard howe deck truss configuration improved simply removing join' +
          't midpoint bottom chord like delete joint three attached members deleted well need add single new me' +
          'mber replace two bottom chord members deleted modification often effective tension members like bott' +
          'om chord members example tensile strength function length removing joint top chord truss shown less ' +
          'likely effective deleting top chord joint replacing two chord members one would double length compre' +
          'ssion member making much weaker would need much larger size steel make member strong enough pass loa' +
          'd test benefit reduced number joints would probably lost try inventing truss configuration copy conf' +
          'iguration actual bridge examples real bridge configurations might consider trusses shown could also ' +
          'designed deck truss notes tips youre confident place new joint exactly member divide go ahead bridge' +
          ' designer automatically split member new joint verify watching member list otherwise use delete add ' +
          'procedure'
  },
  {
    id: 'glos_floor_beams',
    title: 'Floor beams',
    text: 'floor beams transverse members support bridge deck transmit loads deck joints main trusses'
  },
  {
    id: 'glos_footing',
    title: 'Footing',
    text: 'footing base abutment pier foundation rests directly soil transmits load structure soil'
  },
  {
    id: 'glos_forces',
    title: 'Forces',
    text: 'force push pull weight common example force force measured pounds us system measurement newtons si s' +
          'ystem bridge designer forces kilonewtons kn'
  },
  {
    id: 'glossary',
    title: 'Glossary',
    text: 'aashto abutment arch abutments arch supports asphalt astm b bearing bridge design file buckling c ca' +
          'ble anchorages chords client compression concrete connections cut d deck deck truss diagonals displa' +
          'cement drawing grid dynamic load allowance f floor beams footing forces j joints k kilonewton kn l l' +
          'oad factors load test loads m mass density member force member numbers member properties member size' +
          ' members modulus elasticity moment inertia p pier r reinforced concrete resistance factor safe sessi' +
          'on simple supports site cost slope snap points span standard abutments structural analysis structura' +
          'l model substructure supports symmetrical template tension truss u unsafe v verticals w wearing surf' +
          'ace y yield stress yielding'
  },
  {
    id: 'hlp_go_back',
    title: 'Go back button',
    text: 'click go back button display previous design iteration drawing board notes tips go back button locat' +
          'ed main toolbar also available edit menu used go back button display previous design iteration use g' +
          'o forward button display recent iteration also use go iteration button display design iteration brid' +
          'ge designer remembers design iterations long remember work checked edit menu unchecked iterations lo' +
          'st time browser refreshed restarted'
  },
  {
    id: 'hlp_go_forward',
    title: 'Go forward button',
    text: 'click go forward button display recent design iteration drawing board notes tips go forward button l' +
          'ocated main toolbar also available edit menu go forward button activated used go back button least a' +
          'lso use go iteration button display design iteration bridge designer remembers design iterations lon' +
          'g remember work checked edit menu unchecked iterations lost time browser refreshed restarted'
  },
  {
    id: 'hlp_go_to',
    title: 'Go to iteration button',
    text: 'click go iteration button display design iteration browser use browser load drawing board design ite' +
          'ration browser displayed select iteration click ok alternately double click iteration notes tips use' +
          ' tree view tab see design iterations related go iteration button located main toolbar also available' +
          ' edit menu design iteration browser provides preview window help select iteration actually loading d' +
          'rawing board also display previous design iterations go back button bridge designer remembers design' +
          ' iterations long remember work checked edit menu unchecked iterations lost time browser refreshed re' +
          'started'
  },
  {
    id: 'hlp_grid_resolution',
    title: 'Grid resolution buttons',
    text: 'use grid resolution buttons set resolution drawing grid drawing board covered invisible grid draw mo' +
          've joints mouse snaps grid intersections select low medium high resolution pressing respective butto' +
          'n low resolution setting grid 1.0 meter spacing medium high resolution 0.5 meter 0.25 meters respect' +
          'ively notes tips grid resolution buttons located display toolbar theyre also available view menu con' +
          'text menu click grid resolution button tick marks rulers drawing updated show corresponding grid spa' +
          'cing often best create structural model using low resolution grid easier control joint member placem' +
          'ent mode begin optimizing design might switch medium high resolution refine shape structural model p' +
          'recisely always select joint use keyboard arrows move 0.25 meter increments allows small adjustments' +
          ' regardless current grid resolution setting'
  },
  {
    id: 'hlp_how_wpbd_works',
    title: 'How the bridge designer works',
    text: 'bridge designer intended educational purposes use bridge designer experience engineering design proc' +
          'ess simplified form design highway bridge much way practicing civil engineers design real highway br' +
          'idges presented requirement design steel truss bridge carry two lane highway across river may choose' +
          ' wide variety different site configurations bridge cause bridge carry loads different way different ' +
          'site cost develop design bridge drawing picture computer screen first design attempt complete bridge' +
          ' designer test bridge see strong enough carry specified highway loads test includes full color anima' +
          'tion showing truck crossing bridge design strong enough truck able cross successfully structure coll' +
          'apse bridge collapses strengthen changing properties structural components make bridge changing conf' +
          'iguration bridge bridge successfully carry highway loading without collapsing continue refine design' +
          ' objective minimizing cost still ensuring strong enough carry specified loads bridge designer gives ' +
          'complete flexibility create designs using shape configuration want creating design quick experiment ' +
          'many different alternative configurations work toward best possible one process youll use quite simi' +
          'lar one used practicing civil engineers design real structures indeed bridge designer quite similar ' +
          'computer aided design cad software used practicing engineers help way cad software helps taking care' +
          ' heavy duty mathematical calculations concentrate creative part design process good luck notes tips ' +
          'learn bridge designer cloud edition differs earlier versions see whats new bridge designer . bridge ' +
          'designer developed brigadier general retired stephen ressler re engineered twice open source brigadi' +
          'er general retired eugene ressler distributed freely provisions gnu public license version 3 intende' +
          'd solely educational use'
  },
  {
    id: 'hlp_how_to',
    title: 'How to design a bridge',
    text: 'use bridge designer experience engineering design process simplified form design steel truss bridge ' +
          'much way practicing civil engineers design real highway bridges objective create optimal bridge desi' +
          'gn optimal design one satisfies design specifications passes simulated load test costs little possib' +
          'le diagram shows effective method develop optimal design learn methodology click block diagram detai' +
          'led description particular step or.. click browse design process one step time'
  },
  {
    id: 'hlp_increase_member',
    title: 'Increase member size button',
    text: 'click increase member size button increase size currently selected members next larger notes tips in' +
          'crease member size button located member properties toolbar one member selected clicking button incr' +
          'ease size selected members even different example 50mm member 90mm member 120mm member selected clic' +
          'king button change 55mm 100mm 130mm respectively use increase member size button member size list up' +
          'dated reflect change use increase member size button two member properties lists material cross sect' +
          'ion type changed'
  },
  {
    id: 'hlp_joint_tool',
    title: 'Joint tool',
    text: 'use joint tool draw joints create structural model notes tips joint tool located design tools palett' +
          'e also available tools menu joint tool selected mouse pointer appears cross hair'
  },
  {
    id: 'glos_joints',
    title: 'Joints',
    text: 'joint point ends two members connected truss joint assumed act like frictionless pin hinge allows co' +
          'nnected members rotate'
  },
  {
    id: 'glos_kilonewton',
    title: 'Kilonewton',
    text: 'kilonewton kn measurement force si metric system kilonewton 1000 newtons equivalent 225 pounds'
  },
  {
    id: 'glos_kn',
    title: 'kN',
    text: 'kn abbreviation kilonewton metric unit force. equivalent 225 pounds'
  },
  {
    id: 'hlp_load_a_template',
    title: 'Load and display a template',
    text: 'bridge designer includes variety truss templates load display drawing board light gray outlines trac' +
          'e template joints members create stable structural model load display template click load template f' +
          'ile menu select template click ok else double click template displayed drawing board notes tips must' +
          ' drawing board mode load template template loaded hide clicking template button toolbar view menu en' +
          'try'
  },
  {
    id: 'hlp_load_combinations',
    title: 'Load combinations',
    text: 'structural engineers use load combinations account fact structures often experience several differen' +
          't types loads time example bridge must simultaneously carry weight plus weight traffic pedestrians c' +
          'rossing it. bridge might also need carry loads caused high winds snow ice even earthquake highly unl' +
          'ikely extreme loads occur time reason structural design codes specify several different load combina' +
          'tions corresponds particular extreme event really heavy truck loading really strong earthquake examp' +
          'le load combination extreme loading combined average loads might present time 1994 aashto bridge des' +
          'ign specification requires bridge engineers check eleven different load combinations bridge design b' +
          'ridge designer uses one total load = 1.25 w + 1.5 w w + 1.75 1 + dla w = weight structure including ' +
          'deck structural components w w = weight asphalt wearing surface = weight aashto truck loading dla = ' +
          'dynamic load allowance numbers 1.25 1.5 1.75 load factors notes tips fact bridge designer considers ' +
          'one eleven different code specified load combinations one important reason software educational use ' +
          'reasons see realistic bridge designer'
  },
  {
    id: 'glos_load_factors',
    title: 'Load factors',
    text: 'load factor number greater one multiplied design load order represent extreme loading structure exam' +
          'ple load factor 1.75 multiplied standard aashto h25 truck loading represent extremely heavy truck re' +
          'presents heaviest truck might reasonably expected cross bridge lifetime different kinds loads differ' +
          'ent load factors loads unpredictable others example weight bridge predictable weight heavy truck loa' +
          'd factor bridge weight much lower'
  },
  {
    id: 'hlp_load_template',
    title: 'Load template',
    text: 'click load template button load standard truss template display drawing board notes tips load templa' +
          'te button available file menu'
  },
  {
    id: 'glos_load_test',
    title: 'Load test',
    text: 'bridge designer load test simulation shows well design would perform built placed service load test ' +
          'bridge subjected self weight weight standard aashto h25 truck loading. every member structural model' +
          ' checked structural safety'
  },
  {
    id: 'hlp_load_test3',
    title: 'Load test animation',
    text: 'load test animation graphical simulation bridge undergoing load test start animation click load test' +
          ' button animation begins bridge subjected weight steel structural elements concrete deck asphalt wea' +
          'ring surface self weight applied aashto h25 truck moves across bridge left right loads applied bridg' +
          'e bends displacements bridge may exaggerated factor 10 illustrate truss members shorten elongate car' +
          'ry load member forces increase members change color red compression blue tension intense color close' +
          'r member failure one members found unsafe animation shows members failing bridge might look begins c' +
          'ollapse notes tips pause rewind restart animation time using animation controls change appearance lo' +
          'ad test animation opt show changing load test options whenever member found unsafe load test animati' +
          'on depicts failure member either yielding buckling failure mode entirely realistic engineers always ' +
          'build margin safety structural members margin represented load factors code specified load combinati' +
          'ons resistance factors equations tensile strength compressive strength unsafe member might fail migh' +
          't continue carry load reduced margin safety actual bridge possible one members fail without causing ' +
          'total collapse structure however member found unsafe bridge designer considers design unsuccessful'
  },
  {
    id: 'hlp_load_test_button',
    title: 'Load test button',
    text: 'click load test button load test current design notes tips load test button located main toolbar als' +
          'o available test menu load test button drawing board button work tandem one depressed given time cli' +
          'ck one remains depressed click exception youve turned show animation option test menu causes mode sw' +
          'itch back drawing board immediately test complete'
  },
  {
    id: 'hlp_load_test_options',
    title: 'Load test options',
    text: 'auto correct errors check box test menu causes bridge designer attempt identify source instability u' +
          'nstable structural model modify load tested modifications might include deleting unattached joint me' +
          'mber adding new required members. modifications might successful depending type extent instability s' +
          'till best keep option switched unless theres good reason turn show animation check box test menu swi' +
          'tched load test animation displayed every load test animation shown user returned immediately drawin' +
          'g board mode load test exaggeration check box animation settings switched bending bridge exaggerated' +
          ' factor 20 show clearly truss members shorten elongate carry load option displacements exaggerated m' +
          'ember colors check box animation settings switched members change color animation show magnitude mem' +
          'ber force red compression blue tension intense color closer member failure switched members change c' +
          'olor animation notes tips animation starts exaggeration member colors options turned make bridge app' +
          'ear realistic possible shadows animation tax graphics hardware computer animation slow rough turning' +
          ' may improvement'
  },
  {
    id: 'hlp_load_test_status',
    title: 'Load test status',
    text: 'current status design displayed icon status toolbar design always one three possible states construc' +
          'tion structural model yet completed changed since last load test unsafe structural model load tested' +
          ' one members strong enough safely carry specified loads safe structural model load tested members st' +
          'rong enough safely carry specified loads notes tips anytime make change structural model status chan' +
          'ge construction another load test run get detailed numerical results recent load test click report l' +
          'oad test results button member list also summary'
  },
  {
    id: 'hlp_run_load_test',
    title: 'Load test your design',
    text: 'design bridge go back one step go forward one step complete stable structural model must run simulat' +
          'ed load test ensure members design strong enough carry loads prescribed design specification 5 load ' +
          'test design click load test button sit back watch bridge designer perform load test display animatio' +
          'n update load test status display walk ride test using animation controls ready click drawing board ' +
          'button return continue work design notes tips click load test button bridge designer automatically p' +
          'erform following actions create pin roller supports appropriate locations structural model calculate' +
          ' weight members apply forces structure loads calculate weight concrete bridge deck asphalt wearing s' +
          'urface floor beams see design specification 5 information apply corresponding loads structure apply ' +
          'aashto h25 truck loading structure multiple positions representing movement truck across bridge chec' +
          'k structural model stability structural model unstable bridge designer attempt fix problem unsuccess' +
          'ful stop load test inform problem provide suggestions return drawing board perform structural analys' +
          'is considering combined effects bridge self weight truck loading truck position calculate displaceme' +
          'nt joint member force member structural model member compare calculated member forces truck position' +
          's determine absolute maximum tension force absolute maximum compression force. critical forces deter' +
          'mine whether given member safe calculate tensile strength compressive strength member member compare' +
          ' absolute maximum tension force tensile strength compare absolute maximum compression force compress' +
          'ive strength force exceeds strength either case member unsafe member safe prepare display load test ' +
          'animation update load test status display save time run load test without displaying animation see l' +
          'oad test options turn automatic fixing stability problems also explained'
  },
  {
    id: 'glos_loads',
    title: 'Loads',
    text: 'loads forces applied structure highway bridge loads include weight vehicles cross bridge weight brid' +
          'ge cases weight snow ice structure forces caused high winds earthquakes'
  },
  {
    id: 'hlp_local_contest',
    title: 'Local contest code',
    text: 'bridge designer includes support local bridge design contests 6 character local contest code may ent' +
          'ered design project setup wizard code causes automatic selection site conditions including load case' +
          ' task design best possible bridge conditions future enhancement bridge designer depends suitable fun' +
          'ding automatically produce scoreboard designs code youll manually track whos winning enter local con' +
          'test code click new design button display project setup wizard step 2 wizard check yes enter code te' +
          'xt box notes tips first three characters local contest code used uniquely identify contest e.g. nhs ' +
          'northampton high school next two two digit number representing site configuration i.e. deck elevatio' +
          'n supports final character letter b c d designating load case load case consists one two truck avail' +
          'able loadings combined one two available concrete deck thicknesses soon valid 6 character local cont' +
          'est code entered design project setup wizard corresponding site configuration load case displayed pr' +
          'eview window'
  },
  {
    id: 'glos_mass_density',
    title: 'Mass density',
    text: 'mass density material mass per unit volume mass density steel significantly higher concrete asphalt'
  },
  {
    id: 'hlp_material_densities',
    title: 'Material density',
    text: 'density material mass per unit volume bridge designer uses material densities specified 1994 aashto ' +
          'bridge design specifications follows reinforced concrete 2400 kg per cubic meter asphalt 2250 kg per' +
          ' cubic meter steel types 7850 kg per cubic meter'
  },
  {
    id: 'hlp_materials',
    title: 'Materials',
    text: 'bridge designer allows use three different materials design carbon steel common grade structural ste' +
          'el composed primarily iron 0.26% carbon high strength low alloy steel increasingly popular structura' +
          'l steel similar carbon steel significantly stronger higher strength attained small amounts manganese' +
          ' columbium vanadium alloying elements added manufacturing process quenched tempered low alloy steel ' +
          'high strength steel similar high strength low alloy steel strength increased special heat treating p' +
          'rocess notes tips material best choice given structural design answer depends largely relative impor' +
          'tance cost strength yield stress design carbon steel least expensive three alternatives also lowest ' +
          'strength high strength low alloy steel somewhat expensive 40% stronger carbon steel quenched tempere' +
          'd low alloy steel strongest expensive three three materials approximately density modulus elasticity' +
          ' best material often varies structure structure design may use one youll need experiment determine m' +
          'aterials best design determine numerical values yield stress mass density modulus elasticity given m' +
          'aterial select member analysis report menu testing bridge determine costs materials check cost calcu' +
          'lations report'
  },
  {
    id: 'glos_member_force',
    title: 'Member force',
    text: 'member force internal force developed member result loads applied structure member force either tens' +
          'ion compression'
  },
  {
    id: 'hlp_member_list',
    title: 'Member list',
    text: 'member list grid optionally displayed right hand side bridge design window member list reduces space' +
          ' available drawing board hide clicking small close button upper right make space editing structural ' +
          'model member list following lists members current structural model lists engineering properties incl' +
          'uding length material cross section member size slenderness ratio member provides recent load test r' +
          'esults member allows selecting one members order edit allows sorting members grid column notes tips ' +
          'member list load test results shown ratios member force strength compression tension ratio greater o' +
          'ne member unsafe members unsafe tension highlighted blue unsafe compression highlighted red ratio le' +
          'ss one member safe ratio much less one member much stronger needs probably uneconomical addition clo' +
          'se button member list hidden restored view member list menu item select member click corresponding r' +
          'ow member list selected member highlighted light blue member list drawing board click drag mouse but' +
          'ton select range members alternately select range clicking one member holding shift key clicking sec' +
          'ond member selects clicked members members select one member range hold ctrl key clicking rows membe' +
          'r list sort member list click heading column sort example sort members length click heading length c' +
          'olumn first time click column heading list sorted ascending order click sorted descending order thir' +
          'd click restores default sort order number member list used efficiently optimize member properties s' +
          'tructural model. immediately following load test sort compression load test results clicking compres' +
          'sion force/strength column heading. list sorted safe least safe unsafe members bottom list highlight' +
          'ed red excessively strong i.e. uneconomical members top select block members needs made larger small' +
          'er using click drag shift key selection use increase member size button decrease member size button ' +
          'change selected rows repeat tension load test results'
  },
  {
    id: 'hlp_view_member_list',
    title: 'Member list hide and restore',
    text: 'member list hidden provide space drawing bridge design use close button upper right click button app' +
          'ears place reopen notes tips view menus member list item also hides restores member list'
  },
  {
    id: 'glos_member_numbers',
    title: 'Member numbers',
    text: 'every member structural model member number. numbers assigned order create members . physical signif' +
          'icance member numbers used reference member properties load test results reported member number'
  },
  {
    id: 'glos_member_properties',
    title: 'Member properties',
    text: 'properties member 1 material made 2 type cross section e.g solid tube 3 cross section size'
  },
  {
    id: 'hlp_member_properties',
    title: 'Member properties lists',
    text: 'use three member properties lists define material cross section member size member structural model ' +
          'choose member property click drop button reveal list items click item want member size list also upd' +
          'ated using increase member size decrease member size buttons notes tips member properties lists loca' +
          'ted member properties toolbar adding new members material cross section size currently displayed mem' +
          'ber properties lists automatically assigned new member created editing structural model member prope' +
          'rties lists used change properties currently selected members members selected member properties lis' +
          'ts show properties used largest number members current design'
  },
  {
    id: 'glos_member_size',
    title: 'Member size',
    text: 'size member dimensions cross section millimeters'
  },
  {
    id: 'hlp_member_tool',
    title: 'Member tool',
    text: 'use member tool draw members create structural model notes tips member tool located design tools pal' +
          'ette also available tools menu member tool selected mouse pointer appears pencil'
  },
  {
    id: 'glos_members',
    title: 'Members',
    text: 'members individual structural elements make truss connected joints'
  },
  {
    id: 'hlp_menu_bar',
    title: 'Menu bar',
    text: 'menu bar located top bridge design window immediately title bar menu bar provides following commands' +
          ' file new design open file save file save open sample design load template print design export files' +
          ' 3d print recently opened files exit edit select delete undo redo go back go forward go iteration in' +
          'crease member size decrease member size remember work view design tools animation settings member li' +
          'st rulers title block member numbers symmetry guides template grid resolution drawing tools joint to' +
          'ol member tool select tool eraser tool test drawing board load test show animation auto correct erro' +
          'rs report cost calculations load test results member analysis help tip day'
  },
  {
    id: 'glos_modulus_of_elasticity',
    title: 'Modulus of elasticity',
    text: 'modulus elasticity measure materials stiffness resistance deformation material high modulus elastici' +
          'ty deforms little loaded vice versa modulus elasticity represented symbol e expressed units force pe' +
          'r unit area'
  },
  {
    id: 'glos_moment_of_inertia',
    title: 'Moment of inertia',
    text: 'moment inertia measure members resistance bending buckling function shape dimensions member cross se' +
          'ction represented symbol expressed units length raised fourth power'
  },
  {
    id: 'hlp_move_joint',
    title: 'Move a joint',
    text: 'move joint mouse click select tool design tools palette position mouse pointer joint want move press' +
          ' left mouse button hold move mouse pointer new joint location release button joint redrawn new locat' +
          'ion move joint keyboard click select tool design tools palette click joint want move selected joint ' +
          'turn light blue use arrow keys keyboard move joint desired direction 0.25 meter increments notes tip' +
          's must drawing board mode move joint joint already members attached members automatically reposition' +
          'ed along joint joints created automatically bridge designer start new design cannot moved cannot mov' +
          'e one joint top another joint site configurations high pier joints cannot moved onto pier joint drag' +
          'ged mouse joint moves increments corresponding current resolution drawing grid joint moved keyboard ' +
          'moves 0.25 meter increments regardless current grid resolution thus keyboard technique good making s' +
          'mall adjustments position joint'
  },
  {
    id: 'hlp_multiple_selection',
    title: 'Multiple selection of members',
    text: 'use multiple selection change properties several members simultaneously delete several members simul' +
          'taneously five different ways multiple selection drag box click select tool design tools palette hol' +
          'ding left button mouse drag box around members want select release mouse button members entirely enc' +
          'losed within box selected drag left right members completely inside box selected drag right left mem' +
          'bers either inside box touching selected ctrl click drawing board click select tool design tools pal' +
          'ette hold ctrl key keyboard drawing board individually click members want select ctrl click member l' +
          'ist hold ctrl key keyboard member list individually click members want select shift click member lis' +
          't block selection member list click one member start block. hold shift key keyboard member list clic' +
          'k second member complete block members listed first second inclusive selected click drag member list' +
          ' block selection member list click one member start block. drag release select desired block select ' +
          'click select button main toolbar every member structural model selected notes tips selected members ' +
          'turn light blue drawing board member list de select selected members click anywhere drawing board me' +
          'mber de select single member without de selecting remaining members multiple selection hold ctrl key' +
          ' click member want de select'
  },
  {
    id: 'hlp_new_design',
    title: 'New design button',
    text: 'click new design button start new bridge design click button project setup wizard displayed notes ti' +
          'ps new design button located main toolbar also available file menu'
  },
  {
    id: 'hlp_open_sample_design',
    title: 'Open a sample design',
    text: 'bridge designer includes variety sample designs open modify load test stable truss configurations no' +
          'ne optimized minimum cost load sample design click open sample design entry file menu select sample ' +
          'design click ok double click sample design displayed drawing board notes tips must drawing board mod' +
          'e load sample design current structural model saved prompted save sample design loaded'
  },
  {
    id: 'hlp_open_existing',
    title: 'Open an existing bridge design file',
    text: 'open existing bridge design file click open file button main toolbar choose disk drive folder filena' +
          'me want open click ok notes tips file extension bridge design files created bridge designer .bdc sor' +
          'ry cloud edition files compatible earlier bridge designer files current design saved prompted save o' +
          'pen file browser security makes file save restore little different applications installed computer e' +
          'specially true firefox chrome edge chromium based browsers provide better experience'
  },
  {
    id: 'hlp_open_file',
    title: 'Open file button',
    text: 'click open file button open existing bridge design file notes tips open file button located main too' +
          'lbar also available file menu'
  },
  {
    id: 'hlp_optimize_member_selection',
    title: 'Optimize the member properties',
    text: 'design bridge go back one step go forward one step structural model unsafe members design successful' +
          ' however design optimal minimize cost first step optimizing design minimize cost current truss confi' +
          'guration optimizing member properties material cross section member size stage design process change' +
          ' shape configuration current structural model optimize member properties ensure understand bridge de' +
          'signer calculates cost design particular understand trade material cost product cost minimize materi' +
          'al cost several approaches might use minimize material cost following procedure recommended inexperi' +
          'enced designers start using lowest cost weakest available material carbon steel members select appro' +
          'priate cross section member usually best use solid bars tension members hollow tubes compression mem' +
          'bers information see solid bar hollow tube use systematic trial error procedure determine smallest p' +
          'ossible member size every member structural model starting successful design decrease size every mem' +
          'ber next smaller available size see change properties member information. run load test member fails' +
          ' size small change back previous larger size member safe decrease size run load test keep reducing s' +
          'ize running load test member fails increase size one use process systematically every member structu' +
          'ral model ensure every member small inexpensive possibly without failing finally go back check using' +
          ' either two materials high strength steel quenched tempered steel reduce overall cost design steels ' +
          'significantly higher yield stress carbon steel using allow reduce size members without reducing stre' +
          'ngth high strength steel quenched tempered steel expensive dollars per kilogram carbon steel need us' +
          'e trial error determine benefit increased strength sufficient offset greater cost high strength stee' +
          'ls permissible use two three different materials design adjusted materials cross sections member siz' +
          'es minimize material cost design sure run load test ensure members safe optimize based product cost ' +
          'minimized material cost probably introduced large number different products design thus even though ' +
          'material cost low product cost probably quite high total cost almost certainly optimum use following' +
          ' procedure find best balance two competing cost factors check cost calculations report see many prod' +
          'ucts currently included design particular identify products used members structural model change pro' +
          'perties particular members match next larger next stronger available product current design example ' +
          'suppose design includes two 40 mm solid carbon steel bars four 60 mm solid carbon steel bars change ' +
          'two 40 mm bars 60 mm bars modification increase material cost somewhat reduce number products one mo' +
          'dification probably reduce safety structure since making two 40 mm members stronger reduction produc' +
          't cost exceeds increase material cost change good one reject change clicking undo button continue tr' +
          'ial error process selectively increasing member sizes using stronger materials reduce total number p' +
          'roducts design generally find reducing number products creates substantial cost savings first howeve' +
          'r degree standardization increases cost savings get progressively less ultimately much standardizati' +
          'on cause total cost design rise design minimizes total cost optimum moving next step design process ' +
          'sure run load test one time even modifications involved making members larger increasing size member' +
          ' makes member stronger heavier member weights increase total weight truss increases result increase ' +
          'load member forces also increase members previously safe might become unsafe notes tips optimize mem' +
          'ber properties efficiently taking full advantage sorting multiple selection capabilities member list'
  },
  {
    id: 'hlp_optimize_configuration',
    title: 'Optimize the shape of the truss',
    text: 'design bridge go back one step go forward one step point design process optimized member properties ' +
          'one specific truss configuration probably configurations result economical designs design inherently' +
          ' iterative process achieve truly optimal design need experiment many different configurations carefu' +
          'lly observe changes truss geometry affect cost design try totally new truss configuration first opti' +
          'mize shape current structural model change shape truss moving one joints dragging new location mouse' +
          ' keyboard modification easy produce significant reductions cost design optimize shape current struct' +
          'ural model try changing depth truss example suppose started standard pratt truss current design migh' +
          't try reducing depth might try increasing depth first glance reducing depth truss might seem like be' +
          'tter alternative reducing depth make verticals diagonals shorter since members require less material' +
          ' cost decrease. however reducing depth truss also causes member force top bottom chords increase thu' +
          's probably need increase size cost top bottom chord members ensure design still passes load test inc' +
          'rease depth truss opposite effects occur verticals diagonals get longer thus increase cost member fo' +
          'rces top bottom chords decrease allowing use smaller less expensive members chords trade two competi' +
          'ng factors 1 member force top bottom chords 2 length verticals diagonals every truss optimum depth r' +
          'epresents best compromise two factors best way find optimum depth design trial error try changing ov' +
          'erall shape truss example suppose started standard pratt truss current design try moving top chord j' +
          'oints create rounded shape often minor adjustment reduce cost design significantly truss rounded sha' +
          'pe member forces tend nearly equal every member top chord thus get shape right use single optimum me' +
          'mber size entire top chord resulting substantial reduction product cost changing rounded shape also ' +
          'effective bottom chord deck truss notes tips whenever change shape truss need repeat previous three ' +
          'steps design process 1 run load test 2 identify strengthen unsafe members 3 optimize member properti' +
          'es determine whether change effective reducing cost design iteration tracking feature bridge designe' +
          'r helps track optimization steps revert previous one current one didnt work'
  },
  {
    id: 'glos_pier',
    title: 'Pier',
    text: 'pier part bridge substructure provides intermediate support multi span bridge'
  },
  {
    id: 'hlp_pinned_support',
    title: 'Pinned support',
    text: 'pinned support represented symbol prevents joint structural model moving horizontally vertically'
  },
  {
    id: 'hlp_print_drawing',
    title: 'Print a drawing',
    text: 'click print button main toolbar prepare black white drawing design pdf format saved printed printer ' +
          'notes tips printed drawing shows configuration truss annotated member numbers dimensions member prop' +
          'erties shown tabular format bottom page'
  },
  {
    id: 'hlp_print_load_test',
    title: 'Print or copy the load test results',
    text: 'print report recent load test ensure printer connected line click report load test results button st' +
          'atus toolbar load test results report shown table separate window click print button follow browsers' +
          ' printing instructions send report printer notes tips report also copied clipboard clicking copy but' +
          'ton since data tab delimited text format pasted directly spreadsheet google sheets microsoft excel o' +
          'thers'
  },
  {
    id: 'hlp_printer',
    title: 'Printers and printing',
    text: 'print bridge report bridge designer creates pdf file asks browser preview send printer cases window ' +
          'pops show printed youll need press another button send alternately download pdf chrome buttons look ' +
          'like'
  },
  {
    id: 'hlp_purposes',
    title: 'Purposes',
    text: 'purposes bridge designer provide opportunity learn engineering design process provide realistic hand' +
          's experience help understand civil engineers design structures demonstrate engineers use computer to' +
          'ol improve effectiveness efficiency design process provide tool visualizing structural behavior tool' +
          ' help understand structures work notes tips overview software functions see bridge designer works br' +
          'idge designer developed brigadier general retired stephen ressler subsequent versions developed brig' +
          'adier general retired gene ressler versions distributed freely provisions gnu general public license' +
          ' intended solely educational use'
  },
  {
    id: 'hlp_record_design',
    title: 'Record your design',
    text: 'design bridge go back one step youve completed design record document efforts use reference future d' +
          'esigns record final design save design bridge design file print drawing design print load test resul' +
          'ts export files 3d print design notes tips dont wait design complete save bridge design file save ea' +
          'rly save often case... keep remember work checked unless theres great reason bridge designer remembe' +
          'r design even computer fails'
  },
  {
    id: 'hlp_redo',
    title: 'Redo button',
    text: 'click redo button restore change structural model previously undone redo multiple changes clicking a' +
          'rrow right selecting previous change notes tips redo button located main toolbar also found edit men' +
          'u redo button works together undo button'
  },
  {
    id: 'glos_reinforced_concrete',
    title: 'Reinforced concrete',
    text: 'reinforced concrete concrete steel rods embedded inside added strength concrete strong compression c' +
          'omparatively weak tension reinforcing bars substantially increase ability concrete carry tension'
  },
  {
    id: 'hlp_remember_my_work',
    title: 'Remember my work',
    text: 'bridge designer keep track work still even refresh close restart browser computer fails enable featu' +
          're check remember work entry bottom edit menu best keep checked nearly time exception using shared l' +
          'ogin id others computer unchecking box leave prevents seeing design'
  },
  {
    id: 'hlp_report_cost',
    title: 'Report cost calculations button',
    text: 'click report cost calculations button show cost current design calculated report shown table printed' +
          ' copied clipboard notes tips cost calculations report button located status toolbar next bridges cos' +
          't also available report menu use print button make pdf file browser easily send printer use copy but' +
          'ton send report computers clipboard formatted paste easily spreadsheet programs example google sheet' +
          's'
  },
  {
    id: 'hlp_report_load_test',
    title: 'Report load test results button',
    text: 'click report load test results button display detailed numerical results recent load test report sho' +
          'wn table printed copied computers clipboard use report basis strengthening failed members optimizing' +
          ' members structural model notes tips report load test results button located status toolbar also ava' +
          'ilable report menu report includes following member structural model absolute maximum compression fo' +
          'rce member kilonewtons kn compressive strength member kn compression status ok buckles absolute maxi' +
          'mum tension force member kn tensile strength member kn tension status ok yields use print button mak' +
          'e pdf file browser easily send printer use copy button send report computers clipboard formatted pas' +
          'te easily spreadsheet programs example google sheets'
  },
  {
    id: 'hlp_member_details',
    title: 'Report member analysis button',
    text: 'click report member analysis button display member analysis report interactive explorer shows detail' +
          'ed engineering information materials cross sections sizes members current design also shows member s' +
          'trength vs forces acted member previous load test member analysis includes material properties yield' +
          ' stress modulus elasticity mass density cross section properties cross sectional area moment inertia' +
          ' graph member strength vs length tension yielding compression buckling maximum member length passing' +
          ' slenderness test also shown cost per meter member made selected material cross section size members' +
          ' grouped material cross section use material specification menu top pick one graphs show correspondi' +
          'ng strength vs length curve member material group data spike labeled number shown spikes except one ' +
          'ghosts drawn pale colors pick member highlight slider labeled select member see ghost spikes entire ' +
          'bridge rather one material group uncheck focus box members failing slenderness check close dotted ve' +
          'rtical magenta line maximum length member material spec allowed notes tips currently selected member' +
          ' also highlighted member list drawing board check top either force range data spike higher correspon' +
          'ding strength member fails. otherwise carries load successfully forces range vary truck load moves a' +
          'cross bridge force ranges may hard see forces near zero'
  },
  {
    id: 'glos_resistance_factor',
    title: 'Resistance factor',
    text: 'resistance factor dimensionless number used calculation tensile compressive strength structural memb' +
          'ers resistance factor provides margin safety design accounts uncertainty material strength member di' +
          'mensions construction quality resistance factor always less equal one'
  },
  {
    id: 'hlp_restrictions',
    title: 'Restrictions on the use of Bridge Designer',
    text: 'bridge designer intended educational use warranty kind expressed implied authors use software commer' +
          'cial construction purposes prohibited notes tips understand bridge designer good designing real brid' +
          'ge see realistic bd try would invite disaster destruction injury death need design real bridge must ' +
          'obtain services registered professional civil engineer'
  },
  {
    id: 'hlp_roller_support',
    title: 'Roller support',
    text: 'roller support represented symbol prevents joint structural model moving vertically joint still free' +
          ' move horizontally however'
  },
  {
    id: 'hlp_rulers',
    title: 'Rulers',
    text: 'horizontal vertical rulers displayed left bottom edges drawing board rulers allow accurately determi' +
          'ne position mouse draw move joints structural model notes tips rulers calibrated meters marks rulers' +
          ' show locations snap points drawing grid snap points three possible resolutions low medium high swit' +
          'ch among grid resolution buttons measurement marks rulers reflect current setting low resolution eas' +
          'iest new users also creating first rough version design medium fine require little skill mouse let t' +
          'une design get lowest possible price switch among grid resolution buttons measurement marks rulers c' +
          'hange accordingly hide display rulers using view rulers button hide rulers drawing board becomes sli' +
          'ghtly larger help computer screen fewer pixels rulers show limits drawing grid defined design specif' +
          'ications horizontal ruler begins zero ends specified span length vertical ruler reflects specified m' +
          'inimum maximum elevations ground level'
  },
  {
    id: 'glos_safe',
    title: 'Safe',
    text: 'member safe internal member force less strength member tension compression'
  },
  {
    id: 'hlp_save_as',
    title: 'Save as button',
    text: 'click save button save current design new file name notes tips save button file menu want change fil' +
          'e name associated current design use save file button'
  },
  {
    id: 'hlp_save_file',
    title: 'Save file button',
    text: 'click save button save current design bridge design file saved model previously prompted file name s' +
          'aved bridge previously clicking save button causes design saved file notes tips save button located ' +
          'main toolbar also file menu wish save structural model new filename use save button'
  },
  {
    id: 'hlp_save_your_design',
    title: 'Save the current design',
    text: 'time design process save current design bridge design file three different ways save design previous' +
          'ly saved design click save file button main toolbar follow prompts provided browser previously saved' +
          ' design want save new work click save file button previously saved design want save new file name cl' +
          'ick save button file menu follow prompts provided browser notes tips typing ctrl shortcut selecting ' +
          'save file button file extension bridge design files created bridge designer .bdc bridge design files' +
          ' created bridge designer cloud edition cant read earlier versions save structural model time even in' +
          'complete'
  },
  {
    id: 'hlp_select_project',
    title: 'Select a site configuration and load case',
    text: 'design bridge go forward one step start bridge designer first time welcome dialog box offer followin' +
          'g three options select create new bridge design option click ok project setup wizard displayed revie' +
          'w design requirement familiarize project site displayed preview window click next button youre parti' +
          'cipating local contest click yes enter local contest code. otherwise click next entered valid local ' +
          'contest code site configuration load case automatically selected dont enter code may choose 98 site ' +
          'configurations four load cases click next make selections site configuration site configuration cons' +
          'ists elevation deck high water level choice standard abutments simple supports arch abutments arch s' +
          'upports height arch abutments used choice pier pier height pier used choice zero one two cable ancho' +
          'rages selections affects site cost displayed near bottom setup wizard see cost calculations click ar' +
          'row lower right made selections click next select load case load case load case consists choice medi' +
          'um strength high strength concrete deck choice two aashto h25 truck loads one traffic lane single 66' +
          '0 kn permit loading laterally centered deck made selections may click finish complete setup go drawi' +
          'ng board notes tips wizard finished way change site configuration load case start new design. clicki' +
          'ng new design button display setup wizard 98 possible site configurations mentioned four possible lo' +
          'ad cases consisting two deck materials two truck loadings overall makes 392 possible choices represe' +
          'nts different type support loading different cost consistent design specifications total cost bridge' +
          ' equals site cost plus truss cost picking configuration lowest site cost unlikely result lowest tota' +
          'l cost general configurations low site cost tend require relatively high cost truss vice versa findi' +
          'ng best balance engineers example configuration high deck elevation relatively low site cost require' +
          's little excavation high deck elevation also greater span length requires larger heavier truss high ' +
          'truss cost arch abutments cost standard abutments tall arch abutments cost short ones thus site conf' +
          'igurations use arches tend higher site cost. v shape river valley arch abutments also reduce span le' +
          'ngth given deck height taller abutment shorter span arch abutments also provide lateral restraint st' +
          'andard abutments tend decrease truss costs building pier middle river expensive means configurations' +
          ' piers higher site costs without pier also divides one long span two short ones two short trusses us' +
          'ually much less expensive single long one cable anchorages also expensive provide additional support' +
          ' e.g. cable supports cable stayed bridge reduce truss cost significantly choice deck material affect' +
          's site cost loads applied load test medium strength concrete less expensive high strength results th' +
          'icker deck heavier high strength concrete expensive results thinner deck lighter thus less expensive' +
          ' deck material tends result higher truss cost expensive deck material results lower truss cost choic' +
          'e truck loading effect site cost significant effect truss cost engineering design always involves tr' +
          'adeoffs tradeoff cost structure cost supporting substructure critically important aspect real world ' +
          'bridge designs site configuration load case result lowest total cost dont worry take best guess move' +
          ' next step design process well find optimum site configuration later process'
  },
  {
    id: 'hlp_select_all',
    title: 'Select all button',
    text: 'click select button select every member current structural model members selected change member prop' +
          'erties simultaneously notes tips select button located main toolbar also found edit menu'
  },
  {
    id: 'hlp_select_tool',
    title: 'Select tool',
    text: 'use select tool edit structural model need move joint delete joint change member properties delete m' +
          'ember youll need select joint member first clicking select tool notes tips select tool located desig' +
          'n tools palette also available tools menu select tool use mouse pointer appears arrow move select to' +
          'ol drawing board joints members highlighted indicate pointer close enough select'
  },
  {
    id: 'glos_session',
    title: 'Session',
    text: 'initiate new session anytime start new design load sample design open existing bridge design file wi' +
          'thin given session design iterations preserved revert previous design iteration time session clickin' +
          'g go back button'
  },
  {
    id: 'hlp_setup_wizard',
    title: 'Setup wizard',
    text: 'project setup wizard automatically displayed every time start bridge designer choose create new desi' +
          'gn display wizard time click new design button project setup wizard erase drawing board set new desi' +
          'gn prompt read understand design requirement enter local contest code optional skip unless youre par' +
          'ticipating local bridge design contest select deck elevation support configuration bridge select dec' +
          'k material truck loading used design optionally select standard truss template guide design enter de' +
          'signers name project identification name number title block step site design click next button advan' +
          'ce click back button return previous page change selections click finish button accept selections re' +
          'turn drawing board click cancel button reject selections return drawing board click finish button wi' +
          'zard automatically create joints support bridge deck see design specification 3.g information also c' +
          'reate additional supports site configuration youve selected notes tips deck elevation support config' +
          'uration deck material choose determine site cost project cost displayed bottom setup wizard automati' +
          'cally updated change deck elevation support configuration see details showing site cost calculated c' +
          'lick arrow near lower right hand corner project setup wizard youve selected deck elevation support c' +
          'onfiguration click finish button time rest setup optional'
  },
  {
    id: 'hlp_show_animation',
    title: 'Show animation check box',
    text: 'checking menu entry tools show animation causes 3d load test animation shown immediately every load ' +
          'test. uncheck box continue drafting immediately load test notes tips disabling animation allows quic' +
          'ker design iterations'
  },
  {
    id: 'glos_simple_supports',
    title: 'Simple supports',
    text: 'simple supports consist pin one end span roller end roller allows lateral expansion contraction brid' +
          'ge due loads temperature changes bridge designer standard abutments use simple supports'
  },
  {
    id: 'glos_site_cost',
    title: 'Site cost',
    text: 'bridge designer site cost includes cost substructure abutments piers support bridge cost concrete de' +
          'ck site cost must added truss cost determine total project cost'
  },
  {
    id: 'hlp_slenderness',
    title: 'Slenderness check',
    text: 'slender members difficult handle construction site. theyre easily bent buckled fabrication slenderne' +
          'ss check reduces likelihood accidental damage occur slenderness check performed bridge designer base' +
          'd american institute steel construction design code member passes slenderness check slenderness rati' +
          'o l / r meets following condition l / r < 300 l length member r radius gyration member cross section' +
          ' radius gyration r calculated moment inertia member cross sectional area member member fails slender' +
          'ness check considered unserviceable notes tips bridge designer slenderness check performed automatic' +
          'ally draw new member change cross section properties existing member member fails slenderness check ' +
          'i.e. l / r greater 300 member highlighted magenta one members fail slenderness check bridge designer' +
          ' perform load test fix member fails slenderness check decrease length increase member size given mem' +
          'ber size hollow tubes lower l / r solid bars thus solid bar fails slenderness check might also fixed' +
          ' changing hollow tube see maximum length member given cross section member size without failing slen' +
          'derness check click report member properties button maximum length indicated vertical line colored m' +
          'agenta obtain numerical values given cross section member size click report member properties button'
  },
  {
    id: 'glos_slenderness',
    title: 'Slenderness ratio',
    text: 'slenderness ratio number describes thickness member members long comparison cross sections higher sl' +
          'enderness ratios vice versa slender members likely buckle damaged handling slenderness check ensures' +
          ' members slenderness ratios 300 overly slender member causes bridge fail'
  },
  {
    id: 'glos_slope',
    title: 'Slope',
    text: 'slope roadway embankment measure steepness expressed ratio vertical horizontal distance example rive' +
          'r bank slope 2 1 rises two meters every one meter horizontal distance'
  },
  {
    id: 'glos_snap_points',
    title: 'Snap points',
    text: 'snap point intersection two grid lines drawing grid joints drawn snap points thus draw move joints s' +
          'tructural model mouse pointer automatically snaps nearest one grid lines invisible locations indicat' +
          'ed ticks vertical horizontal rulers left bottom edges drawing board'
  },
  {
    id: 'hlp_bars_or_tubes',
    title: 'Solid bar or hollow tube?',
    text: 'optimize member properties design one important decisions make selection cross section type solid ba' +
          'r hollow tube member structural model making decision consider effect different cross sections membe' +
          'r strength tension compression compression members given material hollow tubes somewhat expensive so' +
          'lid bars dollars per kilogram compared solid bar mass though hollow tube provides much larger moment' +
          ' inertia thus hollow tube resists buckling efficiently solid bar compressive strength usually substa' +
          'ntially greater compression members increased compressive strength tube often outweighs increased co' +
          'st per kilogram usually economical use hollow tubes members carry load primarily compression tension' +
          ' members given material solid bars somewhat less expensive hollow tubes dollars per kilogram however' +
          ' tensile strength depends cross sectional area member moment inertia solid bar hollow tube mass also' +
          ' cross sectional area therefore tensile strength since solid bar costs less hollow tube offers stren' +
          'gth advantage tension solid bars usually better choice tension members usually economical use solid ' +
          'bars members carry load primarily tension'
  },
  {
    id: 'glos_span',
    title: 'Span',
    text: 'span bridge length support support'
  },
  {
    id: 'glos_standard_abutments',
    title: 'Standard abutments',
    text: 'bridge designer standard abutments substructure elements use simple supports hold bridge transmit we' +
          'ight soil'
  },
  {
    id: 'hlp_standard_truss',
    title: 'Standard truss configurations',
    text: 'truss bridge deck located top chord called deck truss truss bridge deck located bottom chord called ' +
          'truss number standard truss configurations commonly used bridge structures defined primarily geometr' +
          'y vertical diagonal members three common configurations pictured below. named 19th century engineers' +
          ' developed howe trusses howe truss howe deck truss pratt trusses pratt truss pratt deck truss warren' +
          ' trusses warren truss warren deck truss regardless configuration trusses basic component parts'
  },
  {
    id: 'hlp_start_new_design',
    title: 'Start a new bridge design',
    text: 'start new bridge design click new design button main toolbar project setup wizard displayed review d' +
          'esign requirement click next participating local bridge design contest enter local contest code clic' +
          'k next enter local contest code previous step site configuration automatically selected choose site ' +
          'configuration would like use click next choose deck material determines deck thickness hence deck we' +
          'ight also choose load configuration design want use template choose one click next desired enter nam' +
          'e project id title block click finish notes tips chosen site configuration deck material load config' +
          'uration click finish return drawing board immediately selecting template filling title block optiona' +
          'l make selections deck height support configuration deck material bridge corresponding site cost aut' +
          'omatically calculated displayed near bottom setup wizard see detailed cost calculations click arrow ' +
          'right site cost display click finish wizard automatically create series joints level bridge deck sat' +
          'isfy requirements design specification 3.g abutments deck wearing surface water level displayed draw' +
          'ing board arch supports pier also created automatically included substructure selected current desig' +
          'n saved youll prompted save start new design'
  },
  {
    id: 'hlp_strengthen_failed',
    title: 'Strengthen all unsafe members',
    text: 'design bridge go back one step go forward one step design successful members structural model safe r' +
          'ecent load test load test must strengthen members found unsafe determine unsafe members structural m' +
          'odel use one following methods load test complete return drawing board look structural model member ' +
          'highlighted red unsafe compression member highlighted blue unsafe tension members highlighted struct' +
          'ural model safe check two load test result columns right side member list row highlighted red unsafe' +
          ' compression highlighted blue unsafe tension strengthen unsafe member use one following methods incr' +
          'ease member size run load test see larger member strong enough repeat member passes load test use st' +
          'ronger material unsafe member carbon steel try high strength steel even stronger quenched tempered s' +
          'teel run load test see new material strong enough either method changes member properties notes tips' +
          ' best solution one makes structure strong enough support load least cost many cases increasing membe' +
          'r size best method simply far member sizes available materials member unsafe compression using stron' +
          'ger material may produce little increase strength compressive strength relatively slender members de' +
          'pended yield stress material change properties unsafe member red blue highlighting disappear doesnt ' +
          'necessarily mean member safe. true status member determined re running load test'
  },
  {
    id: 'glos_structural_analysis',
    title: 'Structural analysis',
    text: 'structural analysis mathematical analysis structural model determine member forces resulting given s' +
          'et loads bridge designer uses structural analysis formulation called direct stiffness method'
  },
  {
    id: 'glos_structural_model',
    title: 'Structural model',
    text: 'structural model mathematical idealization actual structure model allows us predict actual structure' +
          ' behave loaded structural model truss following idealized characteristics composed members interconn' +
          'ected joints member connected exactly two joints one end joints assumed act like hinges hold members' +
          ' together prevent rotating respect members carry axial force either compression tension bend loads a' +
          'pplied structure joints supports placed joints'
  },
  {
    id: 'hlp_structural_stability',
    title: 'Structural stability',
    text: 'truss stable members form rigid framework stability usually achieved making truss interconnected tri' +
          'angles example simple truss composed six joints nine members form four interconnected triangles abf ' +
          'bcf cef cde member cf removed however truss becomes unstable without diagonal member center panel tr' +
          'uss consists rectangle bcef rather triangles configuration unstable nothing prevent rectangle distor' +
          'ting parallelogram triangular arrangement members ensures truss structure rigid framework fix unstab' +
          'le truss look panel structural model triangle add one members make notes tips trouble creating stabl' +
          'e structural model try loading template use guide drawing joints members real bridge structure unsta' +
          'ble collapse also turns structural analysis unstable structure mathematically impossible leads divis' +
          'ion zero structural model unstable bridge designer detect attempt fix instability load test attempte' +
          'd fix unsuccessful bridge designer display warning message youll return drawing board eliminate inst' +
          'ability though trusses composed interconnected triangles possible one non triangular panels stable t' +
          'russ particularly true complex trusses arch supports cases probably wont able tell whether truss sta' +
          'ble looking youll need run load test'
  },
  {
    id: 'glos_substructure',
    title: 'Substructure',
    text: 'substructure foundation bridge consists abutments piers support bridge transmit weight earth'
  },
  {
    id: 'glos_supports',
    title: 'Supports',
    text: 'support joint structure attached foundation truss bridge two different types supports 1 pinned suppo' +
          'rts restrain horizontal vertical movement associated joint 2 roller supports restrain vertical movem' +
          'ent allow horizontal expansion structure'
  },
  {
    id: 'glos_symmetrical',
    title: 'Symmetrical',
    text: 'term symmetrical apply structure loading symmetrical structure left right hand sides structure mirro' +
          'r images symmetrical loading loads applied either side bridge centerline identical'
  },
  {
    id: 'glos_template',
    title: 'Template',
    text: 'bridge designer template diagram depicting standard truss configuration load template displayed draw' +
          'ing board gray template shows locate joints members create stable truss'
  },
  {
    id: 'hlp_tensile_strength',
    title: 'Tensile strength',
    text: 'tensile strength member internal member force member becomes unsafe tension actual member force exce' +
          'eds tensile strength member may fail bridge designer tensile strength based yielding failure mode te' +
          'nsile strength represented symbol measured units force kilonewtons kn calculated using following equ' +
          'ation f = 0.95 resistance factor member tension f y yield stress cross sectional area member notes t' +
          'ips equation taken 1994 aashto lrfd bridge design specifications obtain numerical value f y given ma' +
          'terial given cross section member size click report member properties button bridge designer calcula' +
          'tes tensile strength member structural model load test tensile strength member always greater compre' +
          'ssive strength member relatively long slender difference quite substantial'
  },
  {
    id: 'glos_tension',
    title: 'Tension',
    text: 'tension internal axial member force tends <<<lengthen>>> member'
  },
  {
    id: 'hlp_the_engineering',
    title: 'The engineering design process',
    text: 'engineering design process application math science technology create system component process meets' +
          ' human need practice engineering design really specialized form problem solving . consider simple 7 ' +
          'step problem solving process identify problem define problem develop alternative solutions analyze c' +
          'ompare alternative solutions select best alternative implement solution evaluate results civil engin' +
          'eers design bridge usually use process identify problem client hires team engineers design highway b' +
          'ridge cross river define problem engineers investigate proposed site work client determine exactly f' +
          'unctional requirements bridge located many lanes traffic required characteristics river width depth ' +
          'speed current river used ships wide navigable channel much overhead clearance vessels need owns land' +
          ' either side river sort soil rock located engineers also determine aesthetic requirements structure ' +
          'perhaps importantly find much money client willing pay new bridge project budget develop alternative' +
          ' solutions engineers develop several alternative concept designs new bridge perhaps truss arch suspe' +
          'nsion bridge analyze compare alternative solutions engineers analyze design alternative determine st' +
          'rengths weaknesses respect project requirements constraints identified step 2 also consider environm' +
          'ental impact constructability proposed option select best alternative carefully analyzing alternativ' +
          'es engineers select one best satisfies project requirements present selection recommendation client ' +
          'makes final decision implement solution client approved concept design team completes final design p' +
          'repares plans specifications hands construction contractor build evaluate results end project engine' +
          'ers evaluate completed structure identify aspects project went well others could improved observatio' +
          'ns help improve quality future projects design bridge bridge designer follow process identify proble' +
          'm project design truss bridge carry two lane highway across river define problem fully define unders' +
          'tand problem carefully read design specifications familiarize project site develop alternative solut' +
          'ions achieve high quality design need investigate several different site configurations truss config' +
          'urations analyze compare alternative solutions optimize alternative configuration minimum cost compa' +
          're results select best alternative select alternative costs least still passing load test implement ' +
          'solution finalize design record saving printing drawing printing copy load test results perhaps prin' +
          'ting 3d model also build test cardboard model design check learning activities manual available free' +
          ' http //bridgecontest.org/resources/file folder bridges evaluate results think learned design proces' +
          's structural behavior designed bridge apply lessons improve efficiency effectiveness next design not' +
          'es tips description specific procedures use design bridge bridge designer see design bridge'
  },
  {
    id: 'hlp_through_truss',
    title: 'Through truss',
    text: 'truss one deck located level bottom chord vehicles crossing truss bridge supported two main trusses'
  },
  {
    id: 'glos_through_truss',
    title: 'Through truss',
    text: 'truss deck located bottom chord vehicles pass two main trusses cross bridge'
  },
  {
    id: 'hlp_tip_of',
    title: 'Tip of the day',
    text: 'tip day provides general information hints help use bridge designer covers programs advanced feature' +
          's optimizing designs quickly effectively new tip automatically displayed every time start start fres' +
          'h design session also view tips clicking help menu selecting tip day notes tips want see dialog ever' +
          'y new session uncheck show tips startup box restart tips day new session click help menu tip day che' +
          'ck show tips startup box'
  },
  {
    id: 'hlp_title_bar',
    title: 'Title bar',
    text: 'browsers title bar tab displays words bridge designer followed name current bridge design file notes' +
          ' tips possible run bridge designer one tab browser isnt recommended work automatically saved browser' +
          ' local storage tab last tab closed remembered confusing resume work later'
  },
  {
    id: 'hlp_titleblock',
    title: 'Title block',
    text: 'title block lower right hand corner drawing board shows name project name designer project id name d' +
          'esigner optional provide included printed output notes tips project id consists two parts separated ' +
          'dash first part local contest code entered one started design otherwise code corresponding site cond' +
          'itions chose part project id cannot changed second part optional name number helps identify design s' +
          'tart new design setup wizard prompt designers name project id want enter change designers name proje' +
          'ct id begun design click appropriate box drawing boards title block cursor appears enter desired tex' +
          't hide display title block using view title block menu entry'
  },
  {
    id: 'hlp_toolbars',
    title: 'Toolbars',
    text: 'bridge design window includes two rows buttons menu bar theyre called toolbars also free floating to' +
          'ol palette drawing board finally context menu dialog commonly used functions available right clickin' +
          'g drafting panel collection includes controls needed create test optimize record bridge design edit ' +
          'status toolbar toolbar controls creating recording bridges testing iterating design viewing reports ' +
          'cost test results member material details new design button open file button save file button print ' +
          'button export files 3d print button drawing board button load test button select button delete butto' +
          'n undo controls redo controls go back iteration button go forward iteration button go iteration butt' +
          'on current cost report cost calculations button current load test status report load test results bu' +
          'tton report member analysis button member display properties toolbar toolbar controls choosing mater' +
          'ials changing material sizes opting different ways display edit current design member properties lis' +
          'ts increase member size button decrease member size button view member list button view rulers butto' +
          'n view title block button view member numbers button view symmetry guides button view template butto' +
          'n grid resolution buttons palettes design tools animation settings notes tips many toolbar controls ' +
          'available quickly via context widgets'
  },
  {
    id: 'hlp_truss_bridges',
    title: 'Trusses and truss bridges',
    text: 'truss truss arrangement structural members connected together form rigid framework trusses members a' +
          'rranged interconnected triangles shown example result configuration truss members carry load primari' +
          'ly axial tension compression rigid carry load efficiently trusses able span large distances minimum ' +
          'material truss bridges trusses used extensively bridges since early 19th century early truss bridges' +
          ' made wood. classic american covered bridges trusses though wooden truss members covered walls roof ' +
          'protection elements later truss bridges made cast iron wrought iron modern trusses made structural s' +
          'teel truss bridges found many different configurations virtually basic component parts many types br' +
          'idges beam bridges arches suspension bridges cable stayed bridges'
  },
  {
    id: 'hlp_undo',
    title: 'Undo button',
    text: 'click undo button undo recent change structural model notes tips undo button located main toolbar al' +
          'so available edit menu undo multiple changes clicking arrow right selecting previous change undo but' +
          'ton works conjunction redo button'
  },
  {
    id: 'glos_unsafe',
    title: 'Unsafe',
    text: 'member unsafe internal member force exceeds strength member member unsafe tension maximum tension fo' +
          'rce exceeds tensile strength unsafe compression maximum compression force exceeds compressive streng' +
          'th'
  },
  {
    id: 'hlp_using_undo',
    title: 'Using undo and redo',
    text: 'make mistake creating editing structural model click undo button undo error mistakenly undo change r' +
          'estore using redo button undo redo multiple changes clicking respective arrow selecting previous cha' +
          'nge notes tips following actions undone add joint member move joint change properties member delete ' +
          'joint member move drawing labels action undone also restored using redo bridge designer allows 1000 ' +
          'levels undo undo 1000 recent changes structural model undo changes made current design iteration rev' +
          'ert previous design iteration use go back button detailed explanation see whats difference go back u' +
          'ndo'
  },
  {
    id: 'glos_verticals',
    title: 'Verticals',
    text: 'verticals truss members oriented vertically usually connect top bottom chords'
  },
  {
    id: 'hlp_view_animation_settings',
    title: 'View animation settings button',
    text: 'show hide animation settings clicking pale gear animation controls load test animation progress alte' +
          'rnately click animation settings button view menu notes tips wont able show animation settings drawi' +
          'ng board use'
  },
  {
    id: 'hlp_view_tools',
    title: 'View design tools button',
    text: 'click view design tools button view menu display hide design tools palette notes tips wont able show' +
          ' hide design tools palette load test animation progress'
  },
  {
    id: 'hlp_view_member_numbers',
    title: 'View member numbers button',
    text: 'click view member numbers button display hide member numbers drawing board notes tips view member nu' +
          'mbers button located display toolbar also available view menu'
  },
  {
    id: 'hlp_view_rulers',
    title: 'View rulers button',
    text: 'click view rulers button display hide rulers hiding increases space available draw bridge notes tips' +
          ' view rulers button available view menu'
  },
  {
    id: 'hlp_view_symmetry',
    title: 'View symmetry guides button',
    text: 'click view symmetry guides button display hide set two vertical one horizontal guide lines drawing b' +
          'oard use drawing moving joints ensure structural model symmetrical move dragging handles located lef' +
          't side bottom drawing theyre positioned joint opposite intersection shows symmetrical joint location' +
          ' side truss notes tips view symmetry guides button located display toolbar also available view menu ' +
          'several site configurations pier located along centerline bridge cases optimal design probably wont ' +
          'symmetrical'
  },
  {
    id: 'hlp_view_template',
    title: 'View template button',
    text: 'click view template button hide display current template drawing board notes tips view template butt' +
          'on located display toolbar also available view menu whenever new template loaded view template butto' +
          'n toggled display template always displayed behind structural model drawing board'
  },
  {
    id: 'hlp_view_title',
    title: 'View title block',
    text: 'click view title block menu entry hide display title block notes tips computer small screen title bl' +
          'ock interfere drawing bridge hiding fix problem'
  },
  {
    id: 'glos_wearing_surface',
    title: 'Wearing surface',
    text: 'wearing surface layer pavement material normally asphalt concrete placed top bridge deck protect dam' +
          'age vehicle traffic'
  },
  {
    id: 'hlp_not_realistic',
    title: 'What is  not  realistic about the Bridge Designer?',
    text: 'one purposes bridge designer provide realistic hands experience help understand civil engineers desi' +
          'gn real structures many aspects software accurately reflect structural design process however number' +
          ' significant compromises made keep program getting complex bridge designer intended introduction eng' +
          'ineering design emphasis design process rather detailed technical aspects structural design bottom l' +
          'ine aspects bridge designer realistic important understand difference following aspects bridge desig' +
          'ner accurately reflect process practicing civil engineers use design real bridges designing actual b' +
          'ridge engineers must develop detailed designs cost estimates abutments piers roadway deck complete t' +
          'hree dimensional structural system including main trusses connections concrete deck supporting steel' +
          ' framing many secondary members engineers would also need consider environmental impact bridge effec' +
          'ts water ice river channel integral part design bridge designer design main trusses make preliminary' +
          ' decisions configurations roadway supports design strictly two dimensional thus account three dimens' +
          'ional stability designing actual bridge engineers must consider effects fatigue tendency structural ' +
          'material fail prematurely result repetitive loading caused vehicular traffic bridge designer conside' +
          'r fatigue designing actual bridge engineers must consider many different types loading include sever' +
          'al different forms vehicular loads self weight wind snow collision vehicles ships earthquakes must c' +
          'onsider longitudinal lateral position vehicular loads bridge deck must also consider numerous load c' +
          'ombinations eleven 1994 aashto bridge design specification bridge designer considers two types vehic' +
          'ular loading self weight bridge considers longitudinal position vehicular loading lateral position d' +
          'esigning actual bridge engineers must consider limitations deflections amount bending occurs vehicle' +
          ' crosses bridge bridge designer calculates deflections displays load test use design criterion desig' +
          'ning actual bridge engineers must consider many additional member failure modes considered bridge de' +
          'signer bridge designer load test aashto truck loading represents two lanes highway traffic loading m' +
          'oved across bridge one direction left right aashto loading heavy rear axle lighter front axle loadin' +
          'g asymmetrical optimally bridge bridge designer might asymmetrical well however design real bridges ' +
          'must consider movement aashto loading directions left right right left result optimally designed rea' +
          'l world bridges generally symmetrical though bridge designer attempts accurately demonstrate cost tr' +
          'adeoffs inherent engineering design actual costs structural materials components used software inten' +
          'ded accurate designing actual bridge engineers must consider esthetics bridge designer include esthe' +
          'tics design criterion though certainly set personal goal design good looking bridges important recog' +
          'nize limitations exist equally important understand realistic bridge designer'
  },
  {
    id: 'hlp_design_iteration',
    title: 'What is a design iteration?',
    text: 'anytime make one changes structural model run load test performed one design iteration bridge design' +
          'er saves iterations created current session allows switching among time session notes tips switch di' +
          'fferent design iteration click go back button go forward button go iteration button current design i' +
          'teration number always displayed main toolbar number incremented start new iteration make first chan' +
          'ge structural model load test design iteration numbers never duplicated associated designs never cha' +
          'nge even revert previous iteration example suppose working iteration 10 decide go back 6 iteration n' +
          'umber displayed toolbar change 10 6 soon make change structural model iteration number update 11 ini' +
          'tiated new iteration iterations 1 10 remain unchanged see design iterations related using tree view ' +
          'tab reverting previous design iteration particularly useful optimizing design optimization process s' +
          'eldom linear always dead ends unexpected outcomes attempts successful others unsuccessful attempt si' +
          'mply revert previous good iteration try final design iteration saved bridge design files load file d' +
          'esign iteration browser shows iteration forward back buttons disabled'
  },
  {
    id: 'hlp_realistic',
    title: 'What is realistic about the Bridge Designer?',
    text: 'one purposes bridge designer provide realistic hands experience help understand civil engineers desi' +
          'gn real structures many aspects software accurately reflect structural design process however number' +
          ' significant compromises made keep program simple bridge designer intended introduction engineering ' +
          'design emphasis design process rather detailed technical aspects structural design result aspects br' +
          'idge designer realistic others important understand following aspects bridge designer reflect reason' +
          'able accuracy nature engineering design process practicing civil engineers use design real bridges d' +
          'esign open ended process real world design problems always many possible solutions bridge designer s' +
          'hows allowing much freedom choose refine configuration bridge though design open ended process alway' +
          's constrained real world conditions restrictions bridge designer demonstrates limiting design three ' +
          'ways span lengths support configurations must conform conditions project site materials member types' +
          ' must chosen limited set minimizing cost set important goal design inherently iterative process engi' +
          'neers usually work incomplete information must often make assumptions check revise assumptions desig' +
          'n progresses developing high quality solution always requires engineer consider many alternatives ul' +
          'timately select best one bridge designer clearly demonstrates aspect design process impossible achie' +
          've truly optimal bridge design without considering many different alternative truss configurations m' +
          'aterials cross sections member sizes design always involves trade offs usually possible find single ' +
          'solution best satisfies design criteria making improvements one area often causes problems somewhere' +
          ' else experience many trade offs use bridge designer example attempt optimize design discover reduci' +
          'ng depth truss causes cost verticals diagonals decrease get shorter also causes cost top bottom chor' +
          'ds increase member force increases larger member sizes needed preserve structural safety need find o' +
          'ptimum balance two competing criteria structural engineering design regulated use codes codes ensure' +
          ' engineering practiced consistent safe manner throughout country region municipality separate indust' +
          'ry standard codes governing design steel concrete wood structures regional local building codes spec' +
          'ify design loads fire protection standards many requirements designing buildings design highway brid' +
          'ges us governed aashto bridge design specification bridge designer load test uses standard slightly ' +
          'modified aashto truck loading compressive tensile strengths members computed exactly specified aasht' +
          'o specification structures generally designed safely carry one code specified loadings minimizing co' +
          'st also often important objective never important structural safety. cost reductions never made redu' +
          'ctions compromise structural safety formulation bridge designer based relationship safety cost bridg' +
          'e designer design objective minimize cost design never valid fails load test structural design often' +
          ' characterized trade offs material cost fabrication cost construction cost structure designed minimi' +
          'ze material cost design often include many different member types sizes variety member sizes makes h' +
          'arder therefore expensive cut fit members fabrication assemble job site construction structural desi' +
          'gners usually attempt achieve degree standardization selection structural elements even means design' +
          'ing resulting increase material cost usually offset savings fabrication construction costs bridge de' +
          'signer cost calculation simulates trade reasonably well modern structural engineering practice struc' +
          'tural analysis generally performed using computer based method called matrix structural analysis spe' +
          'cifically called direct stiffness method bridge designer uses method compute member forces load test' +
          ' thats good news also important recognize bad news whats realistic bridge designer'
  },
  {
    id: 'hlp_whats_new',
    title: `What's new in the cloud edition?`,
    text: 'welcome welcome cloud edition bridge designer millions users since 2002 bridge designer one successf' +
          'ul educational software technologies world new edition update designed enable bridge designer learni' +
          'ng anyone access web browser get started right introductory engineering experience working alone tea' +
          'm team teacher new features please enjoy checking possibilities.. installation required bridge desig' +
          'ner works recent versions browsers hit web site versions chrome edge firefox 2024 later recommended ' +
          'export 3d model design addition beautiful blueprint style printed version bridge long part bridge de' +
          'signer export obj files suitable favorite 3d printer member analysis report upgrade old member detai' +
          'ls tab interactive explorer supplements members list dynamically updated engineering information mem' +
          'ber cross sections materials lengths costs forces strength use dig deep makes bridge work late updat' +
          'es previous bridge designer versions still 3d walk completed bridges walk fly around animation compl' +
          'eted bridge observe performance truck load drives deck deep undo old limit 5 1000 undo redo last tho' +
          'usand edits current design iteration iterations tree view track design iterations view shows history' +
          ' one chronological list still click drag member list selections click drag select group members memb' +
          'er list'
  },
  {
    id: 'hlp_undo_vs_go_back',
    title: `What's the difference between undo and go back?`,
    text: 'first glance go back undo buttons might appear thing really use undo correct mistakes working curren' +
          't design iteration use go back revert previous design iteration go back normally used optimize bridg' +
          'e undo available 1000 recent changes structural model go back previous design iteration created curr' +
          'ent session undo applies current design iteration disabled whenever go back previous iteration undo ' +
          'enabled soon make new changes structural model'
  },
  {
    id: 'glos_yield_stress',
    title: 'Yield stress',
    text: 'yield stress strength metal force per unit area metal fails yielding'
  },
  {
    id: 'glos_yielding',
    title: 'Yielding',
    text: 'yielding one possible failure mode member made metal metallic material fails yielding undergoes larg' +
          'e deformations i.e. stretches without able carry additional load'
  },
];
