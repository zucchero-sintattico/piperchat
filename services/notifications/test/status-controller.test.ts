import {
  UserStatusRepository,
  UserStatusRepositoryImpl,
} from '@repositories/user-status-repository'
import { Microservice } from '@commons/service'
import { NotificationsServiceConfiguration } from '@/configuration'

let userStatusRepository: UserStatusRepository
const notificationsMicroservice: Microservice = new Microservice(
  NotificationsServiceConfiguration
)

beforeAll(async () => {
  await notificationsMicroservice.start()
  userStatusRepository = new UserStatusRepositoryImpl()
})

afterAll(async () => {
  await notificationsMicroservice.stop()
})

describe('Online status', () => {
  console.log('Testing online status')
  it('A user should change his status from online to offline', async () => {
    await userStatusRepository.setOnline('user1')
    let user = await userStatusRepository.getUser('user1')
    expect(user.status).toBe('online')

    await userStatusRepository.setOffline('user1')
    user = await userStatusRepository.getUser('user1')
    expect(user.status).toBe('offline')
  })
})
