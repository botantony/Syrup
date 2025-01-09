import CouponsEntry from "@/components/CouponsEntry";
import { useTranslation } from "react-i18next";
import { Coupon } from "@/components/CouponCard";
import { parseDomain, fromUrl } from "parse-domain";

export interface CouponData {
    pageIcon: string;
    pageDomain: string;
    pageSubDomain: string;
    isSubDomain: boolean;
    couponsDomain: Coupon[] | null;
    couponsSubDomain: Coupon[] | null;
    handleCopy: (code: string, index: number) => void;
    errorMsg: string;
}

const CouponsPage: React.FC<CouponData> = ({pageIcon, pageDomain, pageSubDomain, isSubDomain, couponsDomain, couponsSubDomain, handleCopy, errorMsg}) => {
    const { t } = useTranslation();

    const parsedDomain = parseDomain(fromUrl(pageDomain));
    const parsedSubDomain = parseDomain(fromUrl(pageSubDomain));

    const getDomainName = (parsed: ReturnType<typeof parseDomain>) => {
        if (parsed.type === 'LISTED' && parsed.icann) {
            return parsed.icann.domain;
        }
        return '';
    };
    const getSubDomainName = (parsed: ReturnType<typeof parseDomain>) => {
        if (parsed.type === 'LISTED' && parsed.icann && parsed.icann.subDomains) {
            return parsed.icann.subDomains.join('.');
        }
        return '';
    }

    const domainName = getDomainName(parsedDomain);
    const subDomainName: string = getSubDomainName(parsedSubDomain);

    const handleDomain = () => {
        const domain = document.querySelector('input[name="couponType"]:checked')?.id;
        if (domain === 'domain') {
            document.querySelector('.Domain')?.classList.remove('hidden');
            document.querySelector('.SubDomain')?.classList.add('hidden');
            document.querySelector('.DomainLabel')?.classList.add('bg-card');
            document.querySelector('.SubDomainLabel')?.classList.remove('bg-card');
        } else {
            document.querySelector('.Domain')?.classList.add('hidden');
            document.querySelector('.SubDomain')?.classList.remove('hidden');
            document.querySelector('.SubDomainLabel')?.classList.add('bg-card');
            document.querySelector('.DomainLabel')?.classList.remove('bg-card');
        }
    }

    return (
        <div className="w-full h-full grid grid-rows-[12%,88%]">
            <div className="domain-switch flex flex-row h-[90%] w-[90%] border-border border-2 rounded-lg mx-[5%]">
                {errorMsg ? (
                    <div className="w-[100%] m-2 flex items-center justify-center bg-card rounded-lg text-foreground text-sm">
                        <p className="text-sm text-center text-red-500 dark:text-red-300">
                            {t(errorMsg)}
                        </p>
                    </div>
                ) : (
                    <>
                        {isSubDomain ? (
                            <>
                                <label htmlFor="domain" className="DomainLabel w-[50%] m-2 flex items-center justify-center rounded-lg text-foreground text-sm cursor-pointer">
                                    {domainName}
                                    <input className="hidden" type="radio" name="couponType" id="domain" onChange={handleDomain}/>
                                </label>
                                <label htmlFor="subDomain" className="SubDomainLabel w-[50%] m-2 flex items-center justify-center rounded-lg text-foreground text-sm cursor-pointer">
                                    {subDomainName}
                                    <input className="hidden" type="radio" name="couponType" id="subDomain" onChange={handleDomain}/>
                                </label>
                            </>
                        ) : (
                            <label htmlFor="domain" className="w-[100%] m-2 flex items-center justify-center bg-card rounded-lg text-foreground text-sm cursor-pointer">
                                {domainName}
                                <input className="hidden" type="radio" name="couponType" id="domain"/>
                            </label>
                        )}
                    </>
                )}
            </div>
            {errorMsg ? (
                <div></div>
            ) : (
                <div>
                    <CouponsEntry
                        className="h-[100%] Domain"
                        pageIcon={pageIcon}
                        pageDomain={pageDomain}
                        couponsDomain={couponsDomain}
                        handleCopy={handleCopy} />
                    <CouponsEntry
                        className="h-[100%] SubDomain hidden"
                        pageIcon={pageIcon}
                        pageDomain={pageSubDomain}
                        couponsDomain={couponsSubDomain}
                        handleCopy={handleCopy} />
                </div>
            )}
        </div>
    );
}

export default CouponsPage;
