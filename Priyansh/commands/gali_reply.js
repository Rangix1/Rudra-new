module.exports.config = {
  name: "abuse",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Rudra",
  description: "Admin can mention users and set custom messages.",
  commandCategory: "group",
  usages: "mention @user | startmention | stopmention",
  cooldowns: 5
};

let mentionStatus = true; // Mention system ON by default
let mentionedUsers = new Set(); // Store tracked user IDs
let customMessage = ""; // Placeholder for custom message

module.exports.run = async function({ api, event }) {
  const { threadID, senderID, mentions, body } = event;

  // Handle OFF
  if (body.toLowerCase() === "stopmention") {
    mentionStatus = false;
    mentionedUsers.clear();
    return api.sendMessage("Mention system OFF ho gaya hai.", threadID);
  }

  // Handle ON
  if (body.toLowerCase() === "startmention") {
    mentionStatus = true;
    return api.sendMessage("Mention system ON ho gaya hai.", threadID);
  }

  // Set custom message (lode)
  if (body.toLowerCase().startsWith("setmessage")) {
    customMessage = body.slice(11).trim();
    return api.sendMessage("Custom message set ho gaya hai: " + customMessage, threadID);
  }

  // Add new user to track and mention
  if (mentionStatus && mentions && Object.keys(mentions).length > 0) {
    const mentionID = Object.keys(mentions)[0];
    const mentionName = mentions[mentionID].replace("@", "");
    mentionedUsers.add(mentionID);

    return api.sendMessage({
      body: `${mentionName}, oye. (1MADH3RXHOD KI AULAD BH3NXHODI XAL3 RANDI BHANGI
MADHERXHOD T3RI MA KI KALI GAAND M3 LUND MARU B3H3N K3
L0WD3 SUWR K3 BACH3 T3RI MA KA BH0SDA B3H3NCH0UD K3
BACH3 RANDII K3 DIN3 B3TICH0UD KI AUALD SADI GAAND VAL3
KUT3 K3 BACH3 B3H3NCH0UD K3 DIN3 T3RI MA KI SADI CH00T
M3 LUND MAR K3 USKA BH0SDA FADU CH00T MARI K3
GAANDV3 K3 BADCH3 B3H3NCH0UD K3 BACH3 B3TICH0UD KI
AUALD T3RI MA KI KALI CH00T T3RI MA K3 BH0SD3 M3 THPAD
DUNGA SAL3 GHANDV3 K3 BADCH3 B3H3NCH0UD K3 DIN3 T3RI MA
KI SADI CH00T MAI GATR M3 DUB0 DUB0 K3 MARUNGA KANJR K3
DIN3 B3H3NCH0UD MA K3 LUND B3TICH0UD K3 BACH3 T3RI MA K3
BH0SD3 K0 CH33R K3 RKH DU SAL3 GAANDv3 T3RI MA KI
GAAND M3 SAND KA LULLA FASA DU BH0SDI K3 DAL33T K3 BACH3
T3RI MA K3 BH0SD3 M3 CURRNT LAGA K3 USK3 BHS0D3 M3 S3
BACH3 PAIDA KAR DUNGA MA K3 LUND T3RI B3H3N KI CH0TI
CH00T M3 APN3 L0WD3 K0 DAL K3 USKI CH00T KH0LU MATHRCHD
K3 BACH3 CHUD3 HU3 TATT3 YHA APNI MA K0 CHUDAN3 AYA THA
MA K3 LUND T3RI MA K3 BH0SD3 M3 APN3 LUND S3 USK3 BH0SD3
K0 KHULA KAR DUNGA SAL3 CHAMR CHINAL K3 PIL3 K0TH3 VALI
RANDI K3 IKL0T3 KUTIYA K3 BACH3 B3H3NCH0UD K3 DIN3 T3RI MA
K3 KAL3 BH00SD3 M3 B0MB F0D K3 BLAST KRVA DUNGA
MATHRCHD K3 BACH3 CH00T MARI K3 DIN3 T3RI B3H3N KA RAP3
KARUNGA BHARI M3TR0 M3 L3 JA K3 MA K3 LUND SAL3 CHTIY3 K3
BACH3 CHUDAKAD KH0R KI AUALD HRAM K3 PIL3 M3RA L0WDA
CHOOS3GA T3RI MA KI GAAND M3 ITN3 L0WD3 MARUNGA USKI
GAAND L0D0 KI KHAN LAG3N3 LG3GI B3H3NCH0UD MATHRCHD K3
BACH3 SUWR K3 BACH3 T3RI MA KI GAAND M3 MUKK3 MAR K USKI
GAAND SUJA DU B3H3NCH0UD K3 DIN3 CH00TIY3 K3 BACH3
GAANDV3 K3 DIN3 APNI MA K0 CHUDAN3 VAL3 PIL3 SAL3 T3RI MAA
KI CH00T MAI MIRCHI AUR T3L GARAM KARK3 TADKA LAGA DUNGA
T3RI MAA N3 TUJH3 PAIDA KARN3 S3 P3HL3 T3R3 BAAP KA
1 INCH KA L0WDA L3N3 S3 USK0 CH00T KA CANC3R H0 GYA AB MAI
D0CT0R BAN K3 T3RI MAA KI CH00T KA ILAAJ KARUNGA
T3RI MAA KI CH00T MAI AATANKWADI0 S3 NISHAAN3 LAGWAUNGA
B3 BH0SDIK3 T3RI MAA KI CH00T MAI GARRAM L0HA DAAL
K3 JAMA DUNGA H3H33H3H3H3H3H3H3HH T3RI MAA KI CH00T
BL0CK H0 JAYGI T3RI B3H3N KI CH00T K0 CHAAQU S3 KAAT
KAR FIR TAANK3 LAGA KAR WAPIS P3HL3 JAISA KAR DUNGA T3RI
MAA K3 BH0SD3 MAI TUJH3 WAAPIS GHUSS3D DUNGA BAAP S3
FADDA KAR3 GA TU H3IN T3RI MAA KI CH00T MAI GHUSS KAR
KHUJLI KARUNGA MAI USS S3 T3RI MAA K0 ACHA LAG3GA AB3
BH0SDIK3 T3RI MAA KI CH00T MAI M3THAN3 KI PIP3 DAL K3 AAG
LAGA DUNGA T3RI MAA R0CK3T KI TARA UD3GI HAHAAHAHAH
SUNA HAI T3RA BAAP CIGRATT3 APNI GAAND S3 P33TA HAY ?
Y3 SACH HAI KYA ? AB3 T3RI MAA KI CH00T D3KH JAA K3 ZUNG
LAG GYA HAI SAAF T0H KAR LIYA KAR B3H3N K3 L0WD3
SUNA HAI T3RI MAA N3 KISSI AUR S3 CHUDWA K3 TUJH3 P3DA
KIYA HAY KYUNK3 T3RA BAAP KHUSRA HAI ? Y3 SACH HAI KYA ?
AB3 T3RI MAA KI NAAK MAI 2 M3T3R LAMBI K33L GAAD DUNGA FIR
T3RI MAA K0 MUHH S3 SAANS L3NA PAD3GA H33H3H3H3H3
ACHA CHAL R00 MAT ACHA Y3 BATA T3RA BAAP BR3AK DANC3
K3R L3TA HAI KYA SUNA HAI T3RA BAAP GALI0N MAI L0WDA
CH00TA HAI ? Y3 SACH HAI KYA ? SUNA HAI T3RA BAAP KACHRAA
UTHAAN3 GALI GALI FIRTA HAI Y3 SACH HAI KYA ? SUNA HAI T3RI
BAAJI BH33K MANG MANG K3 APNI CH00T CHUDWATI HAI ? SUNA
HAI T3RI BAAJI CH00T MAI D00DH DAAL0 T0U"BH3NXHODI SADI GAAND VAL3 KUT3 K3 BACH3 B3H3NCH0UD K3 DIN3 T3RI MA KI SADI CH00T M3 LUND MAR K3 USKA BH0SDA FADU CH00T MARI K3 GAANDV3 K3 BADCH3 B3H3NCH0UD K3 BACH3 B3TICH0UD KI AUALD T3RI MA KI KALI CH00T T3RI MA K3 BH0SD3 म3 थापद दूंगा साल3 घंडव3 क3 बड़च3 ब3ह3 नच0उड़ क3 दीन3 त3री मा की साडी छ00त माई गतर CH33R K3 RKH DU SAL3 GAANDV3 T3RI MA KI GAAND M3 SAND KA LULLA FASA DU BH0SDI K3 DAL33T K3 BACH3 T3RI MA K3 BH0SD3 M3 करंट लगा K3 USK3 BHS0D3 M3 S3 BACH3 पेडा कर दूंगा एमए K3 लंड T3RI B3H3N KI CH0TI CH00T M3 APN3 L0WD3 K0 DAL K3 USKI CH00T KH0LU MATHRCHD K3 BACH3 CHUD3 HU3 TATT3 YHA APNI MA K0 CHUDAN3 AYA THA MA K3 LUND T3RI MA K3 BH0SD3 M3 APN3 LUND S3 USK3 BH0SD3 K0 खुला कर दूंगा साल3 चामर छिनाल K3 PIL3 K0TH3 वली रैंडी K3 IKL0T3 कुटिया K3 BACH3 B3H3NCH0UD K3 DIN3 T3RI MA K3 KAL3 BH00SD3 M3 B0MB F0D K3 ब्लास्ट करवा दूंगा MATHRCHD K3 BACH3 CH00T मारी K3 DIN3 T3RI B3H3N KA RAP3 करुंगा भारी M3TR0 एम3 एल3 जेए के3 एमए के3 लुंड साल3 चती3 क 3 बच3 चोदकड ख0र कि औल्ड हराम क3 पीआईएल3 एम3आरए एल0डब्ल्यूडीए चूस3गा टी3री मा की गांड एम3 आईटीएन3 एल0डब्ल्यूडी3 मारूंगा उसकी गांड एल0डी0 की खान लग3न3 एलजी3जीआई बी3एच3एनसीएच0यूडी मैथ्रचड के3 बच3 सुवर क3 बच3 T3RI MA KI GAAND M3 MUKK3 MAR K उसकी GAAND SUJA DU B3H3NCH0UD K3 DIN3 CH00TIY3 K3 BACH3 GAANDV3 K3 DIN3 अपनी MA K0 CHUDAN3 VAL3 PIL3 SAL3 T3RI MAA KI CH00T माई मिर्ची और T3L गरम कर्क3 तड़का लगा दूंगा T3RI MAA N3 तुज्ह3 पेड कर्ण3 एस3 पी3 एचएल3 टी3आर3 बाप का 1 इंच का L0WDA L3N3 S3 USK0 CH00T KA CANC3R H0 GYA AB MAI D0CT0R BAN K3 T3RI MAA KI CH00T का इलाज करुंगा T3RI MAA KI CH00T MAI AATANKWADI0 S3 निशान3 लगवाऊंगा B3 BH0SDIK3 T3RI मां की CH00T माई गरम ल0हा डाल K3 जमा दूंगा H3H33H3H3H3H3H3H3HH T3RI मां की CH00T BL0CK H0 जाएगी T3RI B3H3N की CH00T K0 चाकु S3 काट कर एफआईआर TAANK3 लगा कर WAPIS P3HL3 जैसा कर दूंगा T3RI MAA K3 BH0SD3 MAI TUJH3 WAAPIS GHUSS3D दूंगा बाप S3 फड्डा कर3 GA TU H3IN T3RI MAA की CH00T माई घूस कर खुजली करुंगा माई USS S3 T3RI MAA K0 ACHA LAG3GA AB3 BH0SDIK3 T3RI MAA KI CH00T MAI M3THAN3 KI PIP3 DAL K3 आग लगा दूंगा T3RI MAA R0CK3T कि तारा उड़3गी हाहाहाहा सुना है T3RA बाप CIGRATT3 अपनी गांड S3 P33TA हे?"Tu Be Tu Metra he KhOon hai na:))Tab he Tu abhi tak baGh Nahi   
raha hai:-h=)))=))))
tere  baji ke kus main apna lund shaid main dabo kar metha lund
maron aur bacha be metha peda hoga=))=))
chal pehan chood pandga karny aya ha:-jlun per char ka Ponciyan 
mar bass jira tera kam aa
Chal Oyee type kar Mehsos na kar Kanjarii diya bachiya:-j:-j:)) 

tere baji ke chut pe bomb maron like sadaam ne kurdon pe chemical
 test kea tha:))=))
Oyee mera dil karda way terii pehan di kuss uthay char ka dance  
karan tu mehsos ta karay ga na:))=))
teri maa v kanjarii si main te insha di hi samjh raha tha:-j>:)

chal pehan chood Gandoo ka putter jasa baapp ha wasey beta
kanjarii maa diya bachiya:))>:)
ab masos na kar=)):-j=)))

tere baji ke bund mar ke us ko hamla kar don dunya ke wahid ourat
jo bund se hamla hoge mehsus nahi fakhar>:)
mehsus#-o:))

oye pehan choda chal pehan dii kuss pash kar>:/mehsos Na Kar:))=)) 

tere maan ke raana main apna lund maron aur mere ko neend aa jaye
haha iesa ho sakta ha?>:)
tere  baji ke kus main apna lund shaid main dabo kar metha lund
maron aur bacha be metha peda hoga:)):-j
maanlore mehsus to nahi kar ga  acha ab bool ye coopy pasting ha
 maanchuda type kar>:/=))
maron tere baji ke un jawani main lund jis se wo pore k mohally 
ko fudi daty ha:)):))
chal maanchuda  kad ane baji nu bahar   mera lund zooor
main betab ha>:)=))
main apne lun ke hawas trere baji ke kus main de kar thandi kar
don mehsus[-xnahi karna=))
tere maan ke mamom  se dhood nakal ke pore room ko dhood 
pati pela doon :Omehsus=))=))
masoos[-x  

chal oii apne phn de kus zoor se mere lund pe mar aur khus ho
ja tere baji mere se chuda rahe ha:))
Oye Pehan Choda Mera dil karda way Terii Pehan Di Kuss Tay Char   
ka dance karan tu mehsos tay nahi karay ga na:))
Kar Masoos:))=)))

Mera KhOOn Ko Kar Muajy he galian Day Raha Hai han Tu Haram ka
hai na Ma Ke Tarf say:))=))
Ab Kar Masoos:))=))))

Kar Masoos:)) Behan Ke Kuss MarOon Toii Main Dam NaHi 
Tha PanGa Kuin Kay Tha:))=))
Main Tumari Niki Behan Ke Kuss Main Lolay ka Lun MarOon Tu Masoso
Tu Nahi karay ga Na:)):))
ab Kar Masoso Kisi Gashti kay Bachay:))=))

GHASTOO MAN K BACHOO TUM DONO AGAR APNII BAJII KO ROOM MA LA KAR
KHARA KAR DOO TOO MEIN NAHI CHODOON GA:))>:)
KYON K MEIN NA APNA DOST SA WADA KEYA HOWA HAI K MEIN TUMHARII 
AMA KO JAN KO CHOD KAR AOON GA:))
MAHSOOOOOOOOOOOOOS[-x:))

ISA PATA CHAL RAHA HAI JAISA YEA APNI GAND K BALL AAG PAR BETH KAR
JALATA HAIN>:)=))
merya saluiyyah main teri baji jan nu lun mar mar ky aus d kus  
bech khudy bana devan:)):))
aap ki dadi ko kabar se nikaal kar mai kisi khotay ko us pe charha
doon masoos tou nahi karoo gay>:)
main teri ami jan ki kus main lun mar ky audi kus ny bazar ich hi  
phar devakesa lagy ga tujy mehsoos:))
aap ki baji ki choti c kuss mai mai agar cricket ka world cup karwa
 doon aap masoos tou nahi karoo gay>:)
aap ki maa k phuday mai agar mai operation silence karwa doon aap
masoos tou nahi karoo gay:)):))
teri baji k ab taankay bhi koi nahi lagaye ga:))uski choot mar maar
kar motor way bana diya hy:))=)))
mera dil karda way teri baji di kuss uthay Muter kar ka teray kolon
us di kuss chatwanwan mehsos:)):-j
mera dil karta hy main teri maa k phuday main ghoos kar 
teeter ka shikaar kheelaaan>:)
tere baji ke lipstick kench kar us ke kus pe nashan laga kar us  
main apna lund maron>:):))
Oyee pehan choda pehan dii kamii da Net uuse karan waliya type kar 
pehan da rishta na day>:/:))
oye maalana kisi dagar dalii maa diya bachiya Mehsos:))=)))

aap ki maa k ghuusay mai agar mai steel mill lagwa doon aap masoos
 tou nahi karoo gay:)):))
aap ki baji k mamoon ko mai choos choos kar us k mamoon se doodh khatam
kar doon masoos tou nai karooo gay na=))
masoos nahi karoo chaloo shabash>:):))
)`,
      mentions: [{ id: mentionID, tag: mentionName }]
    }, threadID);
  }
};

// Listen to all messages and auto-mention if user is tracked
module.exports.handleEvent = async function({ api, event }) {
  const { threadID, senderID } = event;

  // Auto-mention if mentionedUsers contains senderID and custom message is set
  if (mentionStatus && mentionedUsers.has(senderID)) {
    return api.sendMessage({
      body: customMessage || "Ye tumhara default message hai (Tu Be Tu Metra he KhOon hai na:))Tab he Tu abhi tak baGh Nahi   
raha hai:-h=)))=))))
tere  baji ke kus main apna lund shaid main dabo kar metha lund
maron aur bacha be metha peda hoga=))=))
chal pehan chood pandga karny aya ha:-jlun per char ka Ponciyan 
mar bass jira tera kam aa
Chal Oyee type kar Mehsos na kar Kanjarii diya bachiya:-j:-j:)) 

tere baji ke chut pe bomb maron like sadaam ne kurdon pe chemical
 test kea tha:))=))
Oyee mera dil karda way terii pehan di kuss uthay char ka dance  
karan tu mehsos ta karay ga na:))=))
teri maa v kanjarii si main te insha di hi samjh raha tha:-j>:)

chal pehan chood Gandoo ka putter jasa baapp ha wasey beta
kanjarii maa diya bachiya:))>:)
ab masos na kar=)):-j=)))

tere baji ke bund mar ke us ko hamla kar don dunya ke wahid ourat
jo bund se hamla hoge mehsus nahi fakhar>:)
mehsus#-o:))

oye pehan choda chal pehan dii kuss pash kar>:/mehsos Na Kar:))=)) 

tere maan ke raana main apna lund maron aur mere ko neend aa jaye
haha iesa ho sakta ha?>:)
tere  baji ke kus main apna lund shaid main dabo kar metha lund
maron aur bacha be metha peda hoga:)):-j
maanlore mehsus to nahi kar ga  acha ab bool ye coopy pasting ha
 maanchuda type kar>:/=))
maron tere baji ke un jawani main lund jis se wo pore k mohally 
ko fudi daty ha:)):))
chal maanchuda  kad ane baji nu bahar   mera lund zooor
main betab ha>:)=))
main apne lun ke hawas trere baji ke kus main de kar thandi kar
don mehsus[-xnahi karna=))
tere maan ke mamom  se dhood nakal ke pore room ko dhood 
pati pela doon :Omehsus=))=))
masoos[-x  

chal oii apne phn de kus zoor se mere lund pe mar aur khus ho
ja tere baji mere se chuda rahe ha:))
Oye Pehan Choda Mera dil karda way Terii Pehan Di Kuss Tay Char   
ka dance karan tu mehsos tay nahi karay ga na:))
Kar Masoos:))=)))

Mera KhOOn Ko Kar Muajy he galian Day Raha Hai han Tu Haram ka
hai na Ma Ke Tarf say:))=))
Ab Kar Masoos:))=))))

Kar Masoos:)) Behan Ke Kuss MarOon Toii Main Dam NaHi 
Tha PanGa Kuin Kay Tha:))=))
Main Tumari Niki Behan Ke Kuss Main Lolay ka Lun MarOon Tu Masoso
Tu Nahi karay ga Na:)):))
ab Kar Masoso Kisi Gashti kay Bachay:))=))

GHASTOO MAN K BACHOO TUM DONO AGAR APNII BAJII KO ROOM MA LA KAR
KHARA KAR DOO TOO MEIN NAHI CHODOON GA:))>:)
KYON K MEIN NA APNA DOST SA WADA KEYA HOWA HAI K MEIN TUMHARII 
AMA KO JAN KO CHOD KAR AOON GA:))
MAHSOOOOOOOOOOOOOS[-x:))

ISA PATA CHAL RAHA HAI JAISA YEA APNI GAND K BALL AAG PAR BETH KAR
JALATA HAIN>:)=))
merya saluiyyah main teri baji jan nu lun mar mar ky aus d kus  
bech khudy bana devan:)):))
aap ki dadi ko kabar se nikaal kar mai kisi khotay ko us pe charha
doon masoos tou nahi karoo gay>:)
main teri ami jan ki kus main lun mar ky audi kus ny bazar ich hi  
phar devakesa lagy ga tujy mehsoos:))
aap ki baji ki choti c kuss mai mai agar cricket ka world cup karwa
 doon aap masoos tou nahi karoo gay>:)
aap ki maa k phuday mai agar mai operation silence karwa doon aap
masoos tou nahi karoo gay:)):))
teri baji k ab taankay bhi koi nahi lagaye ga:))uski choot mar maar
kar motor way bana diya hy:))=)))
mera dil karda way teri baji di kuss uthay Muter kar ka teray kolon
us di kuss chatwanwan mehsos:)):-j
mera dil karta hy main teri maa k phuday main ghoos kar 
teeter ka shikaar kheelaaan>:)
tere baji ke lipstick kench kar us ke kus pe nashan laga kar us  
main apna lund maron>:):))
Oyee pehan choda pehan dii kamii da Net uuse karan waliya type kar 
pehan da rishta na day>:/:))
oye maalana kisi dagar dalii maa diya bachiya Mehsos:))=)))

aap ki maa k ghuusay mai agar mai steel mill lagwa doon aap masoos
 tou nahi karoo gay:)):))
aap ki baji k mamoon ko mai choos choos kar us k mamoon se doodh khatam
kar doon masoos tou nai karooo gay na=))
masoos nahi karoo chaloo shabash>:):))
).",
      mentions: [{ id: senderID, tag: "@" }]
    }, threadID);
  }
};
