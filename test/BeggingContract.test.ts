import {expect} from "chai";
import {network} from "hardhat";

const {ethers,networkHelpers} = await network.connect();

async function deployContract(){
    const [owner,addr1,addr2] = await ethers.getSigners();
    const begging = await ethers.deployContract("BeggingContract");
    return {begging,owner,addr1,addr2};
}

describe("BeggingContract",function(){
    describe("部署",function(){
        it("Should deploy with initial value 0",async function(){
            const {begging,owner} = await networkHelpers.loadFixture(deployContract);
            expect(await begging.owner()).to.equal(owner.address);
        });
        it("初始总捐赠应为0",async function(){
            const {begging} = await networkHelpers.loadFixture(deployContract);
            expect(await begging.totalDonations()).to.equal(0);
        });
        it("初始合约余额应为0",async function(){
            const {begging} = await networkHelpers.loadFixture(deployContract);
            expect(await begging.getContractBalance()).to.equal(0);
        });
    });

    describe("捐赠功能",function(){
        it("应该允许用户捐赠ETH",async function(){
           const amount1 =ethers.parseEther("0.5");
           const {begging,addr1} = await networkHelpers.loadFixture(deployContract);
            await begging.connect(addr1).donate({value:amount1});
            expect(await begging.getDonation(addr1.address)).to.equal(amount1);
        });
        it("捐赠金额必须大于0",async function(){
            const {begging,addr1} = await networkHelpers.loadFixture(deployContract);
            expect(await begging.connect(addr1).donate({value:0})).to.be.revertedWith("Donation amount must be greater than 0");
        });
        it("初始合约余额应为0",async function(){
            const {begging} = await networkHelpers.loadFixture(deployContract);
            expect(await begging.getContractBalance()).to.equal(0);
        });
    });
    describe("查询功能",function(){ 
        beforeEach(async function(){
            const {begging,addr1,addr2} = await networkHelpers.loadFixture(deployContract);
            this.begging = begging;
            this.addr1 = addr1;
            this.addr2 = addr2;
            await begging.connect(addr1).donate({value:ethers.parseEther("1.0")});
            await begging.connect(addr2).donate({value: ethers.parseEther("2.0")});
        });
        it("应该正确查询捐赠金额",async function(){
            //const {begging,addr1,addr2} = await networkHelpers.loadFixture(deployContract);
            const donation1 = await this.begging.getDonation(this.addr1.address);
            const donation2 = await this.begging.getDonation(this.addr2.address);
            expect(donation1).to.equal(ethers.parseEther("1.0"));
            expect(donation2).to.equal(ethers.parseEther("2.0"));
        });
        it("应该正确查询总捐赠",async function(){
            const total = await this.begging.totalDonations();
            expect(total).to.equal(ethers.parseEther("3.0"));
        })
    });
})