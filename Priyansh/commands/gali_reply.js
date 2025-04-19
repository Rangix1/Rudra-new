module.exports.config = {
  name: "mention2",
  version: "1.0",
  hasPermssion: 2,
  credits: "Rudra",
  description: "Admin ke kehne par sabko auto mention kare",
  commandCategory: "group",
  usages: "mention on/off",
  cooldowns: 3
};

let mentionSystem = false;

module.exports.run = async function({ api, event }) {
  const { threadID, body } = event;

  if (body.toLowerCase() === "mention on") {
    mentionSystem = true;
    return api.sendMessage("Mention System ✅ ON ho gaya!", threadID);
  }

  if (body.toLowerCase() === "mention off") {
    mentionSystem = false;
    return api.sendMessage("Mention System ❌ OFF ho gaya!", threadID);
  }
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, senderID } = event;
  if (!mentionSystem || !event.body) return;

  // Ye message tu apne hisaab se edit kar sakta hai:
  const msg = " bh0s@di ke aisa thappad marunga tere muh ke dant g@1ad se hoker girenge"

"2> jija se bkch0di krta hai m@derch0d tamiz sikh l0wd3"

"3>g@1nd mei tere sua ghusa ke swetter bna dunga"

"4>jh@1nt khayega mera behn ke l0wde"


"5>teri ammy ka asiq hun wo v khufiya asiq ati hai mujhse chummiya lene apne ch00t pe"

"6> teri ammy ke g@1nd ko mukka marke tod dunga m@derch0d baap se bakch0di"

"7> bhagg m@derch0d teri ammy toh nukkad ki r@nd1 hai re"

"8>300 rs wali r@nd1 ke olad"

"9>teri behn k0 utha ke salwar ke sath hi p3lunga"

"10>hahahaha g@nd00 tera baal pakad ke diwal se lada lada ke tera seer phod ke teri ammy ka mang bharungaTu Be Tu Metra he KhOon hai naTab he Tu abhi tak baGh Nahi   
"raha hai"
"tere  baji ke kus main apna lund shaid main dabo kar metha lund
"maron aur bacha be metha peda hoga"
"chal pehan chood pandga karny aya ha:-jlun per char ka Ponciyan" 
"mar bass jira tera kam aa"
"Chal Oyee type kar Mehsos na kar Kanjarii diya bachiya:-j:-j"

"tere baji ke chut pe bomb maron like sadaam ne kurdon pe chemical"
 "test kea tha"
"Oyee mera dil karda way terii pehan di kuss uthay char ka dance"  
"karan tu mehsos ta karay ga na"
"teri maa v kanjarii si main te insha di hi samjh raha tha:-j>:)"

"chal pehan chood Gandoo ka putter jasa baapp ha wasey beta"
"kanjarii maa diya bachiya"
"ab masos na kar"

"tere baji ke bund mar ke us ko hamla kar don dunya ke wahid ourat"
"jo bund se hamla hoge mehsus nahi fakhar>:)"
"mehsus"

"oye pehan choda chal pehan dii kuss pash kar>:/mehsos Na Kar:))=))"

"tere maan ke raana main apna lund maron aur mere ko neend aa jaye"
"haha iesa ho sakta ha"
"tere  baji ke kus main apna lund shaid main dabo kar metha lund"
"maron aur bacha be metha peda hogaj"
"maanlore mehsus to nahi kar ga  acha ab bool ye coopy pasting ha"
 "maanchuda type kar"
"maron tere baji ke un jawani main lund jis se wo pore k mohally" 
"ko fudi daty ha"
"chal maanchuda  kad ane baji nu bahar   mera lund zooor"
"main betab ha"
"main apne lun ke hawas trere baji ke kus main de kar thandi kar"
"don mehsusxnahi" 
"tere maan ke mamom  se dhood nakal ke pore room ko dhood" 
"pati pela doon :Omehsus"
"masoos[-x"  

"chal oii apne phn de kus" "zoor se mere lund pe mar aur khus ho"
"ja tere baji mere se chuda rahe ha"
"Oye Pehan Choda Mera dil karda way Terii Pehan Di Kuss Tay Char"   
"ka dance karan tu mehsos tay nahi karay ga na:))"
"Kar Masoos"

"Mera KhOOn Ko Kar Muajy he galian Day Raha Hai han Tu Haram ka"
"hai na Ma Ke Tarf say"
"Ab Kar Masoos"

"Kar Masoos:)) Behan Ke Kuss MarOon Toii Main Dam NaHi" 
"Tha PanGa Kuin Kay Tha"
"Main Tumari Niki Behan Ke Kuss Main Lolay ka Lun MarOon Tu Masoso"
"Tu Nahi karay ga Na"
"ab Kar Masoso Kisi Gashti kay Bachay"

"GHASTOO MAN K BACHOO TUM DONO AGAR APNII BAJII KO ROOM MA LA KAR"
"KHARA KAR DOO TOO MEIN NAHI CHODOON GA"
"KYON K MEIN NA APNA DOST SA WADA KEYA HOWA HAI K MEIN TUMHARII" 
"AMA KO JAN KO CHOD KAR AOON GA"
"MAHSOOOOOOOOOOOOOS"

"ISA PATA CHAL RAHA HAI JAISA YEA APNI GAND K BALL AAG PAR BETH KAR"
"JALATA HAIN"
"merya saluiyyah main teri baji jan nu lun mar mar ky aus d kus"  
"bech khudy bana devan"
"aap ki dadi ko kabar se nikaal kar mai kisi khotay ko us pe charha"
"doon masoos tou nahi karoo gay"
"main teri ami jan ki kus main lun mar ky audi kus ny bazar ich hi"  
"phar devakesa lagy ga tujy mehsoos"
"aap ki baji ki choti c kuss mai mai agar cricket ka world cup karwa"
 "doon aap masoos tou nahi karoo gay"
"aap ki maa k phuday mai agar mai operation silence karwa doon aap"
"masoos tou nahi karoo gay"
"teri baji k ab taankay bhi koi nahi lagaye ga:))uski choot mar maar"
"kar motor way bana diya hy"
"mera dil karda way teri baji di kuss uthay Muter kar ka teray kolon"
"us di kuss chatwanwan mehsos"
"mera dil karta hy main teri maa k phuday main ghoos kar" 
"teeter ka shikaar kheelaaan"
"tere baji ke lipstick kench kar us ke kus pe nashan laga kar us"  
"main apna lund maron"
"Oyee pehan choda pehan dii kamii da Net uuse karan waliya type kar" 
"pehan da rishta na day"
"oye maalana kisi dagar dalii maa diya bachiya Mehsos:))=)))"
"aap ki maa k ghuusay mai agar mai steel mill lagwa doon aap masoos"
 "tou nahi karoo gay:)):))"
"aap ki baji k mamoon ko mai choos choos kar us k mamoon se doodh khatam"
"kar doon masoos tou naiTERI SEXY BHEN KI CHUT ME ME LODA DAAL KAR RAAT BHAR JOR JOR SE CHODUNGA" ":P =D TERI BHEN KI TIGHT CHUT KO LAOAK LAPAK KAR SPEED SE CHOD DU =D :P TERI BHN KI CHUT CJOD CHOD KE GULABI SE PAAL KAR DUNGA" ":P =D TERA BAAP ABHI MERE LODE KO CHAAT CHAAT KAR KHUS HOTA HAI :P =D TERI BHEN KI GAND ME KUTUB MINAAR" ":P =D TERI BHEN HIJDI WHAT AE RANIDI FAMILY :P =D  SEXY BHEN KI CHUT ME ME LODA DAAL KAR RAAT BHAR JOR JOR SE CHODUNGA" ":P =D TERI BHEN KI TIGHT CHUT KO LAOAK LAPAK KAR SPEED SE CHOD DU =D :P TAPAK LODE FEEL KR BAAP KO AB sun ra chudi hui randi ke aulad"  "tera maa randi ko chodte chodte tera bahen aya boli kya chod" "raha ha ? Ma bol randi chod raha ??aur wo boli randi na chod "  "// <-- YAHAN CHANGE KARNA HO TO KARLENA"

  return api.sendMessage({
    body: msg.replace("@user", "@" + senderID),
    mentions: [{ id: senderID, tag: "@" }]
  }, threadID);
};
